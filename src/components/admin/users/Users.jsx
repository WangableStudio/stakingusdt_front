import out_logo from "./../../../assets/images/output.png";
import in_logo from "./../../../assets/images/input.png";
import UniversalTable from "../../UI/table";
import React, { useState, useEffect } from "react";
import moment from "moment";
import $host from "../../../http";
import { toast } from "react-hot-toast";
import { Box, Input, InputLabel, Modal, Typography, Button } from "@mui/material";

function transformUsersFormat(users) {
  return users.map((item) => ({
    id: item._id,
    tel: item.tel,
    email: item.email,
    balance: `${item.balance} USDT`,
  }));
}

const isClickableIndexes = [0];

// Компонент для отображения пользователей и изменения данных
function Users() {
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [balance, setBalance] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [usersData, setUsersData] = useState([]);

  async function fetchUsersData() {
    try {
      const { data } = await $host.get("/api/user/users");
      console.log(data);
      return data;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const data = await fetchUsersData();
      console.log(data);
      setUsersData(data.users);
    }
    fetchData();
  }, []);

  const headers = ["ID", "Телефон", "email", "Баланс", "Изменение данных"];
  const columnTypes = ["default", "default", "default", "default", "button"];

  // Открытие модального окна и установка текущих данных пользователя
  const onButtonClick = (id) => {
    const item = usersData.find((item) => item._id === id);
    if (!item) return toast.error("Не существующий данный");

    setSelectedUserId(item._id);
    setEmail(item.email);
    setNumber(item.tel);
    setBalance(item.balance);  // Убираем "USDT" для редактирования
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUserId(null);
  };

  // Обработка PUT-запроса для сохранения изменений
  const handleChangeStatus = async () => {
    try {
      const updatedData = {
        email,
        tel: number,
        balance: balance, // Преобразуем в число перед отправкой
      };

      // Отправляем PUT-запрос
      await $host.put(`/api/user/users/${selectedUserId}`, updatedData);
      toast.success("Данные пользователя успешно обновлены");

      // Обновление состояния после успешного запроса
      setUsersData((prevData) =>
        prevData.map((user) =>
          user._id === selectedUserId ? { ...user, ...updatedData } : user
        )
      );

      setModalOpen(false);
    } catch (error) {
      console.error("Ошибка при обновлении данных пользователя:", error);
      toast.error("Не удалось обновить данные пользователя");
    }
  };

  return (
    <div className="container container_status">
      <div className="title">
        <span>Пользователи</span>
      </div>
      <div className="main_con">
        <div className="main_con_partn">
          <UniversalTable
            onButtonClick={onButtonClick}
            data={transformUsersFormat(usersData)}
            headers={headers}
            columnTypes={columnTypes}
            isClickableIndexes={isClickableIndexes}
          />
        </div>
      </div>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: "10px"
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{ fontFamily: "Stolzl" }}>
            Изменить данные пользователя
          </Typography>
          <InputLabel sx={{ mt: 2, fontFamily: "Stolzl", fontSize: "13px", mb: 1 }}>
            Почта пользователя
          </InputLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <InputLabel sx={{ mt: 2, fontFamily: "Stolzl", fontSize: "13px", mb: 1 }}>
            Номер пользователя
          </InputLabel>
          <Input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            fullWidth
          />
          <InputLabel sx={{ mt: 2, fontFamily: "Stolzl", fontSize: "13px", mb: 1 }}>
            Баланс пользователя
          </InputLabel>
          <Input
            type="text"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            fullWidth
          />
          <Button
            onClick={handleChangeStatus}
            variant="contained"
            sx={{ mt: 3, fontFamily: "Stolzl", p: "4px" }}
          >
            Сохранить
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Users;