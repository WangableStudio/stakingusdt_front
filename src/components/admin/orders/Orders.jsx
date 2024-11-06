import out_logo from "./../../../assets/images/output.png";
import in_logo from "./../../../assets/images/input.png";
import "./orders.css"
import UniversalTable from "../../UI/table";
import React, { useState, useEffect } from "react";
import moment from "moment";
import $host from "../../../http";

const balance = "28,778 USDT";

const output_but = "Вывести";
const input_but = "Пополнить";

function transformStakingFormat(staking) {
  return staking.map((item) => ({
    ID: item.ID,
    summa: item.summa,
    date: item.date,
    procent: item.procent,
    income: item.income,
    Status: item.Status,
  }));
}
function calculateTotalBalance(stakings) {
  let totalSum = 0;

  // Проходимся по всем стейкингам и суммируем сумму всех счетов
  stakings.forEach((staking) => {
    const summa = parseFloat(
      staking.summa.replace(" USDT", "").replace(",", "")
    );
    const income = parseFloat(
      staking.income[1].replace(" USDT", "").replace(",", "")
    );
    totalSum += summa + income;
  });

  return totalSum.toFixed(2); // Округляем до двух знаков после запятой
}
function calculateTotalIncomePercentage(stakings) {
  let totalIncomePercentage = 0;
  const currentDate = new Date();

  // Проходимся по всем стейкингам и считаем заработанный процент
  stakings.forEach((staking) => {
    const summa = parseFloat(
      staking.summa.replace(" USDT", "").replace(",", "")
    );
    const procent = parseFloat(
      staking.procent[1].replace("%", "").replace(",", "")
    );
    if (!isNaN(summa) && !isNaN(procent)) {
      // Используем Moment.js для получения количества прошедших дней с момента начала вклада
      const daysElapsed = moment(currentDate).diff(
        moment(staking.date[0]),
        "days"
      );
      console.log(staking.date[0], currentDate);
      console.log(daysElapsed, "daysElapsed");
      // Преобразуем процент в дневную доходность
      const dailyPercentage = (1 + procent / 100) ** (1 / 365) - 1;
      // Рассчитываем заработанный процент с учетом дней вклада
      const currentIncomePercentage =
        summa * ((1 + dailyPercentage) ** daysElapsed - 1);
      totalIncomePercentage += currentIncomePercentage;
    }
  });

  return totalIncomePercentage.toFixed(2); // Округляем до двух знаков после запятой
}

//рендеринг странички "состояние счета"
function Orders() {
  const [stakingData, setStakingData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchStakingData() {
    try {
      const { data } = await $host.get("/api/user/staking");
      return data;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    async function fetchData() {
      const data = await fetchStakingData(); // Assuming fetchStakingData is defined as in the previous example
      setStakingData(data.stakings); // Assuming the data is structured as { stakings: [...] }
    }

    fetchData();
  }, []);
  // Example usage
  fetchStakingData().then((data) => { });
  //лого + ссылки + бегущая строка
  const headers = [
    ["Дата", "ID операции"],
    "ФИО",
    ["Операция", "Реквизиты(вывод)"],
    ["Сумма USDT", "RUB, если RUB"],
    "Способ",
    ["Срок вклада, лет", "Доходность, годовых %"],
    ["Статус", ""]

  ];


  const data = [
    {


      ID: 192834,
      summa: "827,738 USDT",
      date: ["13.05.2024", "13.05.2029"],
      procent: ["5", "30,7%"],
      income: ["17,281 USDT", "29,382 USDT"],
      Status: { status: "active", text: "Активно" },
    },
    {
      ID: 192834,
      summa: "827,738 USDT",
      date: ["13.05.2024", "13.05.2029"],
      procent: ["5", "30,7%"],
      income: ["17,281 USDT", "29,382 USDT"],
      Status: { status: "active", text: "Активно" },
    },
    {
      ID: 192834,
      summa: "827,738 USDT",
      date: ["13.05.2024", "13.05.2029"],
      procent: ["5", "30,7%"],
      income: ["17,281 USDT", "29,382 USDT"],
      Status: { status: "inactive", text: "Завершен" },
    },
  ];
  const columnTypes = [
    "twoLines",
    "default",
    "twoLines",
    "twoLines",
    "default",
    "twoLines",
    "status",
  ];

  if (loading) {
    return null;
  }

  return (
    <div className="container container_status">
      <div className="title">
        {" "}
        <span>Заявки на ввод/вывод</span>
      </div>
      <div className="main_con">
        <div className="main_con_partn">

          <UniversalTable
            //нужно заменить данные
            data={transformStakingFormat(stakingData)}
            headers={headers}
            columnTypes={columnTypes}
          />

        </div>
      </div>
    </div>
  );
}
export default Orders;
