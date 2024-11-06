import React, { useState, useEffect } from "react";
import { Box, Input, InputLabel, Modal, Typography, Button } from "@mui/material";
import $host from "../../../http";  // Обращение к API
import { toast } from "react-hot-toast";
import UniversalTable from "../../UI/table";  // Предположим, что у вас есть универсальная таблица

function InterestRate() {
  const [interestRate, setInterestRate] = useState("");
  const [period, setPeriod] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRateId, setSelectedRateId] = useState(null);
  const [ratesData, setRatesData] = useState([]);

  async function fetchInterestRates() {
    try {
      const { data } = await $host.get("/api/interest-rates");  // Запрос на получение ставок
      setRatesData(data);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  }

  useEffect(() => {
    fetchInterestRates();
  }, []);

  const headers = ["ID", "Период", "Процентная ставка"];
  const columnTypes = ["default", "default", "default"];
  
  const onButtonClick = (id) => {
    const rate = ratesData.find((item) => item._id === id);
    if (!rate) return toast.error("Не существующий ставка");

    setSelectedRateId(rate._id);
    setPeriod(rate.period);
    setInterestRate(rate.interestRate);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRateId(null);
  };

  const handleSaveRate = async () => {
    try {
      const updatedRate = {
        period,
        interestRate,
      };

      if (selectedRateId) {
        // Обновление ставки
        await $host.put(`/api/update-interest-rate/${selectedRateId}`, updatedRate);
        toast.success("Процентная ставка успешно обновлена");
      } else {
        // Создание новой ставки
        await $host.post("/api/set-interest-rate", updatedRate);
        toast.success("Процентная ставка успешно добавлена");
      }

      fetchInterestRates();  // Обновляем список ставок
      setModalOpen(false);
    } catch (error) {
      console.error("Ошибка при сохранении ставки:", error);
      toast.error("Не удалось сохранить ставку");
    }
  };

  return (
    <div className="container">
      <div className="title">
        <span>Управление процентными ставками</span>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginLeft: "20px" }}
          onClick={() => setModalOpen(true)}  // Открыть модальное окно для создания новой ставки
        >
          Добавить новый период
        </Button>
      </div>

      <div className="main_con">
        <UniversalTable
          onButtonClick={onButtonClick}
          data={ratesData.map((rate) => ({
            id: rate._id,
            period: rate.period,
            interestRate: `${rate.interestRate}%`,
          }))}
          headers={headers}
          columnTypes={columnTypes}
        />
      </div>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: "10px",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {selectedRateId ? "Изменить процентную ставку" : "Добавить новую процентную ставку"}
          </Typography>

          <InputLabel sx={{ mt: 2 }}>Период</InputLabel>
          <Input
            type="text"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            fullWidth
            placeholder="Например: 1 год"
          />

          <InputLabel sx={{ mt: 2 }}>Процентная ставка</InputLabel>
          <Input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            fullWidth
            placeholder="Процентная ставка"
          />

          <Button
            onClick={handleSaveRate}
            variant="contained"
            sx={{ mt: 3 }}
          >
            {selectedRateId ? "Сохранить изменения" : "Добавить ставку"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default InterestRate;
