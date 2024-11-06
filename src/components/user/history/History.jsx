import {useEffect, useState} from "react";
import $host from "../../../http";
import UniversalTable from "../../UI/table";
import './history.css'


function transformHistoryFormat(users) {
    return users.map((item) => ({
        createdAt: new Date(item.createdAt).toLocaleString(),
        price: `${item.price} ${item.currency}`,
        method: "Криптосчет",
        operation: item.operation === "WITHDRAW" ? "Вывод" : "Пополнение",
        status: item.status === "PROCESS" ? "Обработка" : "Зачислено"
    }));
}

const headers = [
    "Дата и время",
    "Сумма транзакции",
    "Способ",
    "Операция",
    "Статус"
];

const columnTypes = [
    "default",
    "default",
    "default",
    "default",
    "status",
];


function PartnerHistory (){
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    const fetchTransactions = async () => {
        try {
            const { data } = await $host.get("/api/deposit/transactions");
            setTransactions(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTransactions();
    }, []);

    if(loading) {
        return null;
    }

    console.log(transactions)

    return(
        <div className="container">
            
            <div className="title"><span>История транзакций</span></div>
            <div className="history_table">
            <UniversalTable
                data={transformHistoryFormat(transactions)}
                headers={headers}
                columnTypes={columnTypes}
            />
            </div>

        </div>
    )
}
export default PartnerHistory;