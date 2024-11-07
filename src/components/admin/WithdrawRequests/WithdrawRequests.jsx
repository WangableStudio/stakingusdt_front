import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  InputLabel,
} from "@mui/material";
import UniversalTable from "../../UI/table";
import { useEffect, useState } from "react";
import $http from "../../../http";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import Input from "../../input/Input";
import "./withdrawRequest.css";

function transformUsersFormat(users) {
  return users.map((item) => ({
    userId: item.user._id,
    id: item._id,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    price: item.price + ` ${item.currency}`,
    address: item.address || "",
    typeOfOperation: item.operation === "DEPOSIT" ? "Ввод" : "Вывод",
    status: item.status === "PROCESS" ? "Обработка" : item.status === "WITHDRAW" ? "Обработка" : "Зачислено",
    image: item.image
  }));
}

const headers = [
  "Пользователь",
  "ID",
  "Дата и время",
  "Дата и время изменения",
  "Сумма",
  "Реквизиты вывода",
  "Статус",
  "Изменение статуса",
];

const columnTypes = [
  "default",
  "default",
  "default",
  "default",
  "default",
  "default",
  "default",
  "button",
];

const isClickableIndexes = [0];

const WithdrawRequests = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [price, setPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // начальный порядок сортировки
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      // Пытаемся сделать запрос
      const { data: depositData } = await $http.get(`/api/deposit/`);

      // Если запрос успешен, обновляем состояния
      setData(depositData);
      setFilteredData(depositData);
      console.log("Data fetched successfully:", depositData); // Логируем успешный ответ
    } catch (error) {
      // Обработка ошибки
      if (error.response) {
        // Ошибка от сервера (например, 404, 500)
        console.error("Error response:", error.response);
        toast.error(`Server error: ${error.response.data.message || "Unknown error"}`);
      } else if (error.request) {
        // Ошибка запроса (например, сервер не ответил)
        console.error("Error request:", error.request);
        toast.error("No response from the server.");
      } else {
        // Другие ошибки, например, ошибки в коде
        console.error("Error message:", error.message);
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      // Завершаем загрузку независимо от успеха или ошибки
      setLoading(false);
    }
  };


  // Обработчик поиска
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = data.filter(
        (item) =>
          item.user.toLowerCase().includes(query.toLowerCase()) ||
          item._id.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  // Обработчик сортировки
  const handleSort = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateB - dateA : dateA - dateB;
    });
    setFilteredData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const onButtonClick = (id) => {
    const item = data.find((item) => item._id === id);
    if (!item) {
      return toast.error("Не существующий данный");
    }
    setPrice(item.price);
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setPrice("");
    setSelectedItem({});
    setModalOpen(false);
  };

  const handleChangeStatus = async () => {
    const withdraw = selectedItem;
    const withdrawStatus = withdraw.status === "WITHDRAW"
    if (!withdraw) {
      return toast.error("Не существующий данный");
    }
    const toastId = toast.loading("Loading...");
    const isWithdraw = withdraw.operation === "WITHDRAW";
    const requestData = {
      price: price, // Всегда отправляем цену
      ...(withdrawStatus && { periodbalance: true }) // Если статус "WITHDRAW", добавляем periodbalance: true
    };
    try {
      const { data } = await $http.post(
        `/api/deposit/change-status/${withdraw._id}`,
        requestData
      );
      await fetchData();
      toast.success(
        isWithdraw
          ? "Деньги успешно выведены у пользователя"
          : "Деньги успешно пополнились у пользователя",
        { id: toastId }
      );
      handleModalClose();
    } catch (e) {
      console.log(e.response.data.message);
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message, { id: toastId });
      } else {
        toast.error(e.message, { id: toastId });
      }
    }
  };

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
          component="h1"
          variant="h4"
          sx={{
            fontSize: "35px",
            fontFamily: "Stolzl",
            mt: "50px",
          }}
        >
          Заявки на ввод/вывод
        </Typography>

        {/* Поле поиска */}
        <TextField
          label="Поиск"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ mb: 2, width: "100%", fontFamily: "Stolzl" }}
        />

        {/* Кнопка сортировки */}
        <Button
          onClick={handleSort}
          variant="contained"
          sx={{ mb: 2, fontFamily: "Stolzl" }}
        >
          Сортировать по дате (
          {sortOrder === "asc" ? "по убыванию" : "по возрастанию"})
        </Button>

        <div className="withdraw-table">
          <UniversalTable
            onButtonClick={onButtonClick}
            data={transformUsersFormat(filteredData)}
            headers={headers}
            columnTypes={columnTypes}
            isClickableIndexes={isClickableIndexes}
          />
        </div>
      </Box>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 3,
            borderRadius: "10px",
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{
              fontFamily: "Stolzl",
            }}
          >
            Изменить сумму и статус
          </Typography>
          <InputLabel
            sx={{
              mt: 2,
              fontFamily: "Stolzl",
              fontSize: "13px",
              mb: 1,
            }}
          >
            Новая сумма
          </InputLabel>
          <Input
            type="number"
            value={price}
            setValue={(value) => setPrice(value)}
            style={{
              width: "100%",
            }}
          />
          <Button
            onClick={handleChangeStatus}
            variant="contained"
            sx={{
              mt: 3,
              fontFamily: "Stolzl",
              p: "4px",
            }}
          >
            Изменить статус
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default WithdrawRequests;
