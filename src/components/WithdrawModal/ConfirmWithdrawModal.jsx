import Box from '@mui/material/Box';
import { Button, MenuItem, Modal, Select, Typography } from "@mui/material"
import Input from '../input/Input';
import CustomSelect from '../CustomSelect/CustomSelect';

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

const ConfirmWithdrawModal = ({ onClose, open, changeStep }) => {
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
                    Ваш запрос принят!
                </Typography>
                <Typography
                    sx={{
                        mt: "15px",
                        fontSize: "11px",
                        fontFamily: 'Stolzl'
                    }}
                >
                    Ваша заявка на вывод средств принята. Наш сотрудник свяжется с Вами по номеру, указанному при регистрации для уточнения дополнительных вопросов. Мы делаем это в целях безопасности. Благодарим Вас за терпение! Отследить статус операции можно в окне История транзакций ID 987678
                </Typography>
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
                    Спасибо
                </Button>
            </Box>
        </Modal>
    );
}

export default ConfirmWithdrawModal;