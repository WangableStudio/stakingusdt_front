import out_logo from "./../../../assets/images/output.png";
import in_logo from "./../../../assets/images/input.png";
import React, { useState, useEffect } from "react";
import moment from "moment";
import TopUpModal from "../../TopUpModal/TopUpModal";
import TopUpModalConfirm from "../../TopUpModalConfirm/TopUpModalConfirm";
import TopUpModalAccepted from "../../TopUpModalAccepted/TopUpModalAccepted";
import WithdrawModal from "../../WithdrawModal/WithdrawModal";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { AxiosError } from "axios";
import UniversalTable from "../../UI/table";
import $host from "../../../http";
import "./style.css";
import WithdrawReferalModal from "../../WithdrawModal/WithdrawReferalModal";
import WithdrawPeriodModal from "../../WithdrawModal/WithdrawPeriodModal";

const output_but = "Вывести";
const input_but = "Пополнить";

const calculateDiffBetweenData = (dateString, numberOfYears) => {
    const startDate = new Date(dateString);
    const endDate = new Date(startDate);
    endDate.setFullYear(startDate.getFullYear() + numberOfYears);

    const diff = endDate - startDate;
    const days = diff / (1000 * 60 * 60 * 24);
    return days;
}

const getPercent = (depositTerm, interestRate) => {
    // Если процентный ставкой уже есть, используем его
    if (interestRate) {
        return interestRate / 100;
    }

    // Старые проценты по количеству лет
    switch (depositTerm) {
        case 1:
            return 0.107;
        case 2:
            return 0.157;
        case 3:
            return 0.207;
        case 4:
            return 0.257;
        case 5:
            return 0.307;
        default:
            return 0;
    }
}


const headers = [
    "ID",
    "Сумма вклада",
    ["Дата открытия", "/ дней до окончания"],
    ["Срок вклада", "% доходности (год)"],
    ["Доходность текущая", "Ожидаемая"],
    "Статус",
    "Вывод средств"
];

const columnTypes = [
    "default",
    "default",
    "twoLines",
    "twoLines",
    "twoLines",
    "status",
    "buttonwithdraw"
];

const calculateTotalIncomeForToday = (createdAtString, depositTerm, price, currency, status, interestRate) => {
    if (status === "PROCESS") {
        return 0;
    }

    if (currency === "RUB") {
        price = price / 90;
    }

    const today = new Date();
    const annualPercent = getPercent(depositTerm, interestRate);
    const incomeForYear = price * annualPercent;
    const dailyIncome = incomeForYear / 365;

    const daysElapsed = moment(today).diff(
        moment(createdAtString),
        "days"
    );

    return dailyIncome * daysElapsed;
};

const transformStakingFormat = (staking) => {
    return staking.map((item) => {
        const endDate = new Date(item.createdAt);
        endDate.setFullYear(endDate.getFullYear() + item.depositTerm);
        const today = new Date();

        const canWithdraw = today >= endDate;

        return {
            ID: item._id,
            price: item.price.toFixed(2) + ` ${item.currency}`,
            date: [
                moment(item.createdAt).format("YYYY-MM-DD HH:mm"),
                calculateDiffBetweenData(item.createdAt, item.depositTerm)
            ],
            percent: [`${item.depositTerm || 0}`, `${item.interestRate}%`],
            income: [
                calculateTotalIncomeForToday(item.createdAt, item.depositTerm, item.price, item.currency, item.status, item.interestRate).toFixed(2) + ` ${item.currency}`,
                (item.price * (item.depositTerm || 0) * getPercent(item.depositTerm, item.interestRate)).toFixed(2) + ` ${item.currency}`,
            ],
            status: item.status === "PROCESS" ? "Обработка" : "Зачислено",
            canWithdraw // Новый флаг для проверки возможности вывода
        };
    });
};


const calculateTotalBalance = (stakings) => {
    return stakings.reduce((totalSum, staking) => {
        const summa = parseFloat(
            staking.summa.replace(" USDT", "").replace(",", "")
        );
        const income = parseFloat(
            staking.income[1].replace(" USDT", "").replace(",", "")
        );
        return totalSum + summa + income;
    }, 0).toFixed(2);
}

const calculateTotalIncomePercentage = (stakings) => {
    let totalIncomePercentage = 0;
    const currentDate = new Date();

    stakings.forEach((staking) => {
        const summa = parseFloat(
            staking.summa.replace(" USDT", "").replace(",", "")
        );
        const procent = parseFloat(
            staking.procent[1].replace("%", "").replace(",", "")
        );
        if (!isNaN(summa) && !isNaN(procent)) {
            const daysElapsed = moment(currentDate).diff(
                moment(staking.date[0]),
                "days"
            );
            const dailyPercentage = (1 + procent / 100) ** (1 / 365) - 1;
            const currentIncomePercentage =
                summa * ((1 + dailyPercentage) ** daysElapsed - 1);
            totalIncomePercentage += currentIncomePercentage;
        }
    });

    return totalIncomePercentage.toFixed(2);
}

const PartnerStatus = () => {
    const [stakingData, setStakingData] = useState([]);
    const [ratesData, setRatesData] = useState([]);
    const [stepOfModals, setStepsOfModals] = useState(0);
    const [stepOfWithdraw, setStepOfWithdraw] = useState(0);
    const [stepOfWithdrawReferal, setStepOfWithdrawReferal] = useState(0);
    const [stepOfWithdrawPeriod, setStepOfWithdrawPeriod] = useState(0);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.user?.currentUser?.user);
    const [formData, setFormData] = useState({
        price: 100,
        depositTerm: 0,
        address: "",
        operation: "WITHDRAW",
        currency: "USDT",
        image: null,
        status: "PROCESS"
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image") {
            const file = files && files.length > 0 ? files[0] : null;
            setFormData((prev) => ({ ...prev, [name]: file })); // сохраняем объект File
        } else {
            
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };
    async function fetchStakingData() {
        try {
            const { data } = await $host.get("/api/deposit/transactions", {
                params: {
                    operation: "DEPOSIT"
                }
            });
            setStakingData(data);
        } catch (error) {
            console.error("There was a problem with your fetch operation:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (type = "DEPOSIT", refbalance = false) => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("price", formData.price);
            formDataToSend.append("depositTerm", formData.depositTerm);
            formDataToSend.append("address", formData.address);
            formDataToSend.append("operation", type);
            formDataToSend.append("refbalance", refbalance);
            formDataToSend.append("currency", formData.currency);
            formDataToSend.append("image", formData.image); // Передаем файл
            formDataToSend.append("status", formData.status); // Передаем файл
            console.log(formDataToSend);

            // Добавляем операцию (можно добавлять как обычное поле)

            console.log(formDataToSend);
            console.log(formData);

            const method = formData.status == "WITHDRAW" ? `/api/deposit/period-withdraw` : `/api/deposit`

            // // Отправляем данные
            const response = await $host.post(method, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Устанавливаем заголовок
                },
            });

            setStepOfWithdraw(2);
            toast.success("Заявка принята. Ждите подтверждения администраторов");
        } catch (e) {
            if (e instanceof AxiosError) {
                toast.error(e.response?.data?.message);
            } else {
                toast.error(e.message);
            }
        }
    };
    async function fetchInterestRates() {
        try {
            const { data } = await $host.get("/api/interest-rates");  // Запрос на получение ставок
            setRatesData(data);
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        }
    }

    const handleWithdraw = (balance, earnings, depositTerm) => {
        console.log(balance, earnings);
        console.log(depositTerm);
        const num = Number(depositTerm)
        // Удаляем 'USDT' и преобразуем значения в числа
        const validBalance = parseFloat(balance.replace(" USDT", "")) || 0;
        const validEarnings = parseFloat(earnings.replace(" USDT", "")) || 0;
        const updatedPrice = validBalance + validEarnings;
    
        console.log(formData);
        // Обновляем formData и статус
        setFormData((prevData) => ({
            ...prevData,
            price: updatedPrice,
            status: "WITHDRAW",
            depositTerm: num
        }));
        console.log(formData);
    
        // Устанавливаем шаг вывода средств
        setStepOfWithdrawPeriod(1);
    };    


    useEffect(() => {
        fetchInterestRates();
        fetchStakingData();
    }, []);

    const onChangeStepWithdraw = async (type = "WITHDRAW", refbalance = true) => {
        await handleSubmit(type, refbalance);
    }

    if (loading) {
        return null;
    }

    const bonusFromReferrals = user.referrals.reduce((acc, item) => acc + (item.balance * 0.1), 0);
    return (
        <>
            <TopUpModal
                open={stepOfModals === 1}
                onClose={() => setStepsOfModals(0)}
                changeStep={() => setStepsOfModals(2)}
                handleChange={handleChange}
                ratesData={ratesData}
                formData={formData}
            />
            <TopUpModalConfirm
                open={stepOfModals === 2}
                formData={formData}
                handleChange={handleChange}
                onClose={() => setStepsOfModals(0)}
                changeStep={() => {
                    handleSubmit();
                    setStepsOfModals(3)
                }}
            />
            <TopUpModalAccepted
                open={stepOfModals === 3}
                onClose={() => setStepsOfModals(0)}
                changeStep={() => setStepsOfModals(0)}
            />

            <WithdrawModal
                open={stepOfWithdraw === 1}
                onClose={() => setStepOfWithdraw(0)}
                changeStep={onChangeStepWithdraw}
                handleChange={handleChange}
                formData={formData}
            />
            <WithdrawReferalModal
                open={stepOfWithdrawReferal === 1}
                onClose={() => setStepOfWithdrawReferal(0)}
                changeStep={() => { onChangeStepWithdraw(formData.operation) }}
                handleChange={handleChange}
                ratesData={ratesData}
                formData={formData}
            />
            <WithdrawPeriodModal
                open={stepOfWithdrawPeriod === 1}
                onClose={() => setStepOfWithdrawPeriod(0)}
                changeStep={() => { onChangeStepWithdraw(formData.operation, false) }}
                handleChange={handleChange}
                ratesData={ratesData}
                formData={formData}
            />

            <div className="container container_status">
                <div className="title">
                    {" "}
                    <span>Состояние счета</span>
                </div>
                <div className="main_con">
                    <div className="main_con_partn">
                        <div className="card">
                            <div className="title_card">Сумма всех счетов</div>

                            <div className="balance_card">
                                {user?.balance.toFixed(2) + " USDT"}
                            </div>

                            <div className="description_card">
                                Дата последнего пополнения: {moment(user.lastDepositTime).format("YYYY-MM-DD HH:mm")}
                            </div>

                            <div className="button_block">
                                {/* <div
                                    style={{
                                        cursor: "pointer",
                                        opacity: '0.5'
                                    }}
                                    onClick={() => setStepOfWithdraw(1)}
                                    className="output_button"
                                >
                                    <img src={out_logo} alt="text" />
                                    {output_but}
                                </div> */}
                                <div
                                    style={{
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setStepsOfModals(1)}
                                    className="input_button"
                                >
                                    <img src={in_logo} alt="text" />
                                    {input_but}
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="title_card">Заработано, % с вложений</div>

                            <div className="balance_card">
                                {stakingData.reduce((acc, item) => acc + calculateTotalIncomeForToday(item.createdAt, item.depositTerm, item.price, item.currency, item.status, item.interestRate), 0).toFixed(2)} USDT
                            </div>

                            {/* <div className="button_block">
                                <div style={{ opacity: '0.5' }} className="output_button">
                                    <img src={out_logo} alt="text" />
                                    {output_but}
                                </div>
                            </div> */}
                        </div>

                        <div className="card">
                            <div className="title_card">Бонусы с реферальной программы</div>

                            <div className="balance_card">{user.refbalance.toFixed(2)} USDT</div>

                            <div className="description_card">
                                Бонус 10% от пополнения вашего реферала.
                            </div>

                            <div className="button_block">
                                {/* <div style={{ cursor: 'pointer' }} onClick={() => setStepOfWithdrawReferal(1)} className="output_button">
                                    <img src={out_logo} alt="text" />
                                    Вывести бонусы
                                </div> */}
                                <div style={{ opacity: '0.5', cursor: 'pointer' }} className="output_button">
                                    <img src={out_logo} alt="text" />
                                    Вывести бонусы
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="title_balance">Стейкинг</div>
                <div className="status_table">
                    <UniversalTable
                        data={transformStakingFormat(stakingData)}
                        headers={headers}
                        columnTypes={columnTypes}
                        handleWithdraw={handleWithdraw}
                        isClickableIndexes={[]}
                    />
                </div>
            </div>
        </>
    );
}

export default PartnerStatus;