import React from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";


const AdminNavbar = () => {
    
    return (
        <header className="container">
            <Box
                sx={{
                    display: "flex",
                    marginRight: "auto"
                }}
            >
                <Link 
                    style={{
                        padding: "10px 50px 10px 50px",
                        borderBottom: '1px solid #00000080',
                        borderRadius: "5px",
                        color: "#000000",
                        textDecoration: "none",
                        display: "block"
                    }}
                    to="/users"
                    
                >
                    Пользователи
                </Link>
                <Link 
                    style={{
                        padding: "10px 50px 10px 50px",
                        borderBottom: '1px solid #00000080',
                        borderRadius: "5px",
                        color: "#000000",
                        textDecoration: "none",
                        display: "block",
                        marginLeft: "15px"
                    }}
                    to="/withdraw-requests"
                >
                    Заявки на ввод/вывод
                </Link>
                <Link 
                    style={{
                        padding: "10px 50px 10px 50px",
                        borderBottom: '1px solid #00000080',
                        borderRadius: "5px",
                        color: "#000000",
                        textDecoration: "none",
                        display: "block",
                        marginLeft: "15px"
                    }}
                    to="/interest-rate"
                >
                    Период
                </Link>
            </Box>
        </header>
    );
}

export default AdminNavbar;