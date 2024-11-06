import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import './profile.css'


const Profile = () => {
    const user = useSelector((state) => state.user?.currentUser?.user);
    console.log(user);
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
                    Личный кабинет
                </Typography>
                <Box
                    className="profile_box-column"
                    sx={{
                        display: "flex",
                        gap: "20px",
                        marginTop: "35px",
                        justifyContent: "space-between"
                    }}
                >
                    <Box
                        className="profile_box-column__mini"
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
                                {user?.id}
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
                                {user?.lastName}
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
                                {user?.firstName}
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
                                {user?.surName}
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
                                fontWeight: 400
                            }}
                        >
                            Запросить изменение информации
                        </Button>
                    </Box>
                    <Box
                    className="profile_box-column__mini"
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
                            Для подтверждения личности Вам необходимо отправить следующие документы<br/> и фото на почту nextcryptoinvest@gmail.com или в Телеграм-аккаунт @nextcryptoinvest_bot:
                            <br/><br/>
                            Серия и номер паспорта,<br/>
                            Ваше фото с паспортом, где четко видно лицо и данные в паспорте (пример),<br/>

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
        </Box>
    );
}

export default Profile;