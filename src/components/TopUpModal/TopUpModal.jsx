import Box from '@mui/material/Box';
import { Button, MenuItem, Modal, Select, Typography } from "@mui/material"
import Input from '../input/Input';
import CustomSelect from '../CustomSelect/CustomSelect';
import { useEffect, useState } from 'react';
import $host from '../../http';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 700,
    width: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const TopUpModal = ({ onClose, open, changeStep, handleChange, formData, ratesData }) => {
    const handleNextStep = () => {
        // Проверка обязательных полей перед переходом на следующий шаг
        if (!formData.address || !formData.depositTerm) {
            alert("Пожалуйста, заполните поля для пополения и срок вклада.");
            return;
        }
        if (formData.price < 100) {
            alert("Минимальная сумма пополнения 100 usdt.");
            return;
        }
        // Если все обязательные поля заполнены, выполняем переход на следующий шаг
        changeStep();
    };
    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <Box sx={style}>
                <Typography
                    sx={{
                        fontSize: "16px",
                        fontFamily: 'Stolzl'
                    }}
                >
                    Заявка на пополнение
                </Typography>
                <Typography
                    sx={{
                        mt: "15px",
                        fontSize: "11px",
                        fontFamily: 'Stolzl'
                    }}
                >
                    Выберите валюту пополнения
                </Typography>

                <Box
                    sx={{
                        mt: "21px",
                    }}
                >
                    <Button
                        variant={formData.currency === "USDT" ? 'contained' : "outlined"}
                        name={"currency"}
                        value={"USDT"}
                        onClick={handleChange}
                        sx={{
                            borderRadius: "30px",
                            fontFamily: 'Stolzl',
                            color: formData.currency === "USDT" ? "#ffffff" : "#000000",
                            px: "35px"
                        }}
                    >
                        USDT TRC20
                    </Button>
                    {/* <Button
                        variant={formData.currency === "RUB" ? 'contained' : "outlined"}
                        name={"currency"}
                        value={"RUB"}
                        onClick={handleChange}
                        sx={{
                            borderRadius: "30px",
                            fontFamily: 'Stolzl',
                            color: formData.currency === "RUB" ? "#ffffff" : "#000000",
                            px: "35px",
                            ml: "10px"
                        }}
                    >
                        RUB
                    </Button> */}
                </Box>
                <Box sx={{
                    display: "flex",
                    mt: "15px"
                }}>
                    <Typography
                        sx={{
                            fontSize: "10px",
                            fontFamily: 'Stolzl',
                            width: "50%"
                        }}
                    >
                        Сумма пополнения
                    </Typography>
                    <Input
                        type="text"
                        value={formData.price}
                        setValue={(value) => handleChange({
                            target: {
                                value: value,
                                name: "price"
                            }
                        })}
                        style={{
                            width: "50%"
                        }}
                    />
                </Box>
                <Box sx={{
                    display: "flex",
                    mt: "20px"
                }}>
                    <Typography
                        sx={{
                            fontSize: "10px",
                            fontFamily: 'Stolzl',
                            width: "50%"
                        }}
                    >
                        Ваш кошелек
                    </Typography>
                    <Input
                        type="text"
                        value={formData.address}
                        setValue={(value) => handleChange({
                            target: {
                                value: value,
                                name: "address"
                            }
                        })}
                        style={{
                            width: "50%"
                        }}
                    />
                </Box>
                <Box sx={{
                    display: "flex",
                    mt: "15px",
                    alignItems: "center"
                }}>
                    <Typography
                        sx={{
                            fontSize: "10px",
                            fontFamily: 'Stolzl',
                            width: "50%"
                        }}
                    >
                        Срок вклада
                    </Typography>
                    <CustomSelect handleChange={handleChange} formData={formData} ratesData={ratesData} />
                </Box>

                <Box
                    sx={{
                        marginTop: "15px"
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            background: "#2C84EC0D",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "10px",
                                fontFamily: 'Stolzl',
                                width: "50%",
                                padding: "6px 8px"
                            }}
                        >
                            Срок
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "10px",
                                fontFamily: 'Stolzl',
                                width: "50%",
                                padding: "6px 8px"
                            }}
                        >
                            % доходности, годовых
                        </Typography>
                    </Box>
                    {ratesData.map(rate => {
                        const rateNumber = Number(rate.period)
                        // Преобразование значения period в читаемую форму
                        let period;
                        switch (rateNumber) {
                            case 1:
                                period = "1 год";
                                break;
                            case 2:
                                period = "2 года";
                                break;
                            case 3:
                                period = "3 года";
                                break;
                            case 4:
                                period = "4 года";
                                break;
                            case 5:
                                period = "5 лет";
                                break;
                            default:
                                period = rate.period; // на случай, если период не указан в списке
                        }

                        // Форматирование процента
                        const formattedRate = `${rate.interestRate.toFixed(1)}%`;

                        return (
                            <Box
                                sx={{
                                    display: "flex",
                                    background: "#2C84EC0D",
                                }}
                                key={rate.period} // добавляем уникальный ключ
                            >
                                <Typography
                                    sx={{
                                        fontSize: "10px",
                                        fontFamily: 'Stolzl',
                                        width: "50%",
                                        padding: "6px 8px"
                                    }}
                                >
                                    {period}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: "10px",
                                        fontFamily: 'Stolzl',
                                        width: "50%",
                                        padding: "6px 8px"
                                    }}
                                >
                                    {formattedRate}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>

                <Typography
                    sx={{
                        fontSize: "10px",
                        fontFamily: 'Stolzl',
                        width: "100%",
                        mt: "15px"
                    }}
                >
                    После открытия вклада, средства будут заморожены на выбранный период.
                </Typography>
                <Button
                    variant='contained'
                    onClick={handleNextStep}
                    sx={{
                        borderRadius: "30px",
                        fontFamily: 'Stolzl',
                        color: "#ffffff",
                        px: "35px",
                        mt: "15px",
                        fontSize: "11px"
                    }}
                >
                    Далее
                </Button>
            </Box>
        </Modal>
    );
}

export default TopUpModal;