import Box from '@mui/material/Box';
import { Button, MenuItem, Modal, Select, Typography } from "@mui/material"
import Input from '../input/Input';
import CustomSelect from '../CustomSelect/CustomSelect';
import { useContext } from 'react';
import { useSelector } from 'react-redux';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const WithdrawPeriodModal = ({ onClose, open, changeStep, handleChange, formData, ratesData }) => {
    const user = useSelector((state) => state.user?.currentUser?.user);
    console.log(formData);
    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{

            }}
        >
            <Box sx={style}>
                <Typography
                    sx={{
                        fontSize: "16px",
                        fontFamily: 'Stolzl'
                    }}
                >
                    Заявка на вывод средств
                </Typography>
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
                        Вывод (куда?)
                    </Typography>
                    <CustomSelect type={'referal'} handleChange={handleChange} formData={formData} periodeData={ratesData} />
                </Box>
                {formData.operation === "DEPOSIT" && (
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
                )}

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
                        Сумма списания в USDT
                    </Typography>
                    <Input
                        type="text"
                        readOnly
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
                        Кошелек для перевода
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

                <Button
                    variant='contained'
                    onClick={changeStep}
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

export default WithdrawPeriodModal;