import { Box, Button, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import $host from "../../../http";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import UniversalTable from "../../UI/table";

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

const getPercent = (years) => {
    switch (years) {
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
    "Тип",
    "Статус"
];

const columnTypes = [
    "default",
    "default",
    "twoLines",
    "twoLines",
    "twoLines",
    "default",
    "status",
];

const calculateTotalIncomeForToday = (createdAtString, annualPercent, price, currency, status) => {
    if (status === "PROCESS") {
        return 0;
    }

    if (currency === "RUB") {
        price = price / 90;
    }
    const today = new Date();
    const incomeForYear = price * annualPercent;
    const dailyIncome = incomeForYear / 365;

    const daysElapsed = moment(today).diff(
        moment(createdAtString),
        "days"
    );

    return dailyIncome * daysElapsed;
};

const transformStakingFormat = (staking) => {
    return staking.map((item) => ({
        ID: item._id,
        price: item.price.toFixed(2) + ` ${item.currency}`,
        date: [moment(item.createdAt).format("YYYY-MM-DD HH:mm"), calculateDiffBetweenData(item.createdAt, (item.depositTerm || 0))],
        percent: [(item.depositTerm || 0), `${getPercent(item.depositTerm) * 100}%`],
        income: [
            calculateTotalIncomeForToday(item.createdAt, getPercent(item.depositTerm), item.price, item.currency, item.status).toFixed(2) + ` ${"USDT"}`,
            (item.price * (item.depositTerm || 0) * getPercent(item.depositTerm)).toFixed(2) + ` ${item.currency}`,
        ],
        typeOfOperation: item.operation === "DEPOSIT" ? "Ввод" : "Вывод",
        status: item.status === "PROCESS" ? "Обработка" : "Зачислено",
        image: item.image 
    }));
}

const AdminProfile = () => {
    const [stakingData, setStakingData] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    async function fetchStakingData() {
        try {
            const { data } = await $host.get(`/api/deposit/transactions/${id}`, {
                
            });
            console.log(data)
            setStakingData(data);
        } catch (error) {
            console.error("There was a problem with your fetch operation:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchData = async () => {
        try {
            const { data } = await $host.get(`/api/user/users/${id}`);
            setUser(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData()
        fetchStakingData()
    }, [id])

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return null;
    }

    return (
        <Box className="container">
            <Box sx={{ width: "100%" }}>
                <Typography
                    sx={{
                        fontSize: "35px",
                        fontFamily: "Stolzl",
                        marginTop: "50px"
                    }}
                >
                    Личный кабинет пользователя {user._id}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        gap: "20px",
                        marginTop: "35px",
                        justifyContent: "space-between"
                    }}
                >
                    <Box
                        sx={{
                            width: "40%"
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "20px",
                                lineHeight: "24px",
                                fontFamily: "Stolzl",

                            }}
                        >
                            Контактная информация
                        </Typography>
                        <Box sx={{
                            display: "flex",
                            width: "100%",
                            marginTop: "35px"
                        }}>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    lineHeight: "14.4px",
                                    fontFamily: "Stolzl",
                                    width: "50%"
                                }}
                            >
                                ID
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    lineHeight: "14.4px",
                                    fontFamily: "Stolzl",
                                    width: "50%"
                                }}
                            >
                                {user._id}
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: "flex",
                            width: "100%",
                            marginTop: "10px"
                        }}>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    lineHeight: "14.4px",
                                    fontFamily: "Stolzl",
                                    width: "50%"
                                }}
                            >
                                Фамилия
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    lineHeight: "14.4px",
                                    fontFamily: "Stolzl",
                                    width: "50%"
                                }}
                            >
                                {user?.lastName ? user.lastName : 'Не указан'}
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            width: "100%",
                            marginTop: "10px"
                        }}>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    lineHeight: "14.4px",
                                    fontFamily: "Stolzl",
                                    width: "50%"
                                }}
                            >
                                Имя
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    lineHeight: "14.4px",
                                    fontFamily: "Stolzl",
                                    width: "50%"
                                }}
                            >
                                {user?.firstName ? user.firstName : 'Не указан'}
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            width: "100%",
                            marginTop: "10px"
                        }}>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    lineHeight: "14.4px",
                                    fontFamily: "Stolzl",
                                    width: "50%"
                                }}
                            >
                                Отчество
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    lineHeight: "14.4px",
                                    fontFamily: "Stolzl",
                                    width: "50%"
                                }}
                            >
                                {user?.surName ? user.surName : 'Не указан'}
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            width: "100%",
                            marginTop: "10px"
                        }}>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    lineHeight: "14.4px",
                                    fontFamily: "Stolzl",
                                    width: "50%"
                                }}
                            >
                                Тел.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    lineHeight: "14.4px",
                                    fontFamily: "Stolzl",
                                    width: "50%"
                                }}
                            >
                                {user?.tel}
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            width: "100%",
                            marginTop: "10px"
                        }}>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    lineHeight: "14.4px",
                                    fontFamily: "Stolzl",
                                    width: "50%"
                                }}
                            >
                                E-mail
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    lineHeight: "14.4px",
                                    fontFamily: "Stolzl",
                                    width: "50%"
                                }}
                            >
                                {user.email}
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            width: "100%",
                            marginTop: "10px"
                        }}>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    lineHeight: "14.4px",
                                    fontFamily: "Stolzl",
                                    width: "50%"
                                }}
                            >
                                Баланс
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    lineHeight: "14.4px",
                                    fontFamily: "Stolzl",
                                    width: "50%"
                                }}
                            >
                                {user.balance}
                            </Typography>
                        </Box>
                        <Typography
                            sx={{
                                fontSize: "20px",
                                lineHeight: "24px",
                                fontFamily: "Stolzl",
                                marginTop: "20px"
                            }}
                        >
                            Рефералы
                        </Typography>
                        <Box sx={{
                            display: "flex",
                            width: "100%",
                            marginTop: "10px",
                            justifyContent: 'left',
                            flexWrap: 'wrap',
                            gap: '20px'
                        }}>
                            {user.referrals.length > 0 ? (
                                user.referrals.map((item, index) => (
                                    <Typography
                                        key={index}
                                        sx={{
                                            fontSize: "12px",
                                            lineHeight: "14.4px",
                                            fontFamily: "Stolzl",
                                        }}
                                    >
                                        <Link to={`/profile/${item}`}>
                                            {item}
                                        </Link>
                                    </Typography>
                                ))
                            ) : (
                                <Typography
                                    sx={{
                                        fontSize: "12px",
                                        fontWeight: "400",
                                        color: "#0009",
                                        fontFamily: "Stolzl",
                                    }}
                                >
                                    Рефералы отсутствуют
                                </Typography>
                            )}
                        </Box>
                        {/* <Button
                            variant="contained"
                            sx={{
                                marginTop: "40px",
                                width: "100%",
                                borderRadius: "30px",
                                color: "#2C84EC",
                                fontFamily: "Stolzl",
                                fontSize: "13px",
                                lineHeight: "16px",
                                color: "#ffffff",
                                padding: "12px 32px 12px 32px",
                                fontWeight: 400
                            }}
                        >
                            Запросить изменение информации
                        </Button> */}
                    </Box>
                    <Box
                        sx={{
                            width: "50%"
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "20px",
                                lineHeight: "24px",
                                fontFamily: "Stolzl"
                            }}
                        >
                            Верификация
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "13px",
                                lineHeight: "15px",
                                fontFamily: "Stolzl",
                                marginTop: "35px"
                            }}
                        >
                            Для подтверждения личности Вам необходимо отправить следующие документы<br /> и фото на почту nextcryptoinvest@gmail.com или в Телеграм-аккаунт @nextcryptoinvest_bot:
                            <br /><br />
                            Серия и номер паспорта,<br />
                            Ваше фото с паспортом, где четко видно лицо и данные в паспорте (пример),<br />

                            Если данные, указанные при регистрации, не будут совпадать с паспортными данными, мы не сможем верифицировать Ваш аккаунт в целях безопасности. Благодарим за понимание.
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                marginTop: "40px",
                                width: "100%",
                                borderRadius: "30px",
                                color: "#2C84EC",
                                fontFamily: "Stolzl",
                                fontSize: "13px",
                                lineHeight: "16px",
                                color: "#ffffff",
                                padding: "12px 32px 12px 32px",
                                fontWeight: 400,
                                width: "80%"
                            }}
                        >
                            Я отправил(-а) документы, подать заявку
                        </Button>
                        <Typography
                            sx={{
                                fontSize: "13px",
                                lineHeight: "15px",
                                fontFamily: "Stolzl",
                                marginTop: "50px"
                            }}
                        >
                            При возникновении вопросов, связанных с изменением личных данных, верификацией аккаунта и секретным словом, пишите нам на почту – nextcryptoinvest@gmail.com
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box>
                <UniversalTable
                    data={transformStakingFormat(stakingData)}
                    headers={headers}
                    columnTypes={columnTypes}
                    isClickableIndexes={[]}
                />
            </Box>
        </Box>
    );
}

export default AdminProfile;