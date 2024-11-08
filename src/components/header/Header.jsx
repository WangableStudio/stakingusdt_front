import "./header.css";

import { Link, NavLink } from "react-router-dom";

import iconLogo from "./../../assets/images/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./../../reducers/userReducer";
import { useEffect, useState } from "react";

//шапка
const Header = () => {
    const isAuth = useSelector((state) => state.user.isAuth);
    const user = useSelector((state) => state.user?.currentUser?.user);
    const dispatch = useDispatch();
    const isAdmin = user?.role === "ADMIN";

    const [rates, setRates] = useState({
        BTC_USD: null,
        BTC_RUB: null,
        USDT_RUB: null,
        ETH_USD: null,
        ETH_RUB: null,
    });

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd,rub`);
                const data = await response.json();
                setRates({
                    BTC_USD: data.bitcoin.usd,
                    BTC_RUB: data.bitcoin.rub,
                    USDT_RUB: data.tether.rub,
                    ETH_USD: data.ethereum.usd,
                    ETH_RUB: data.ethereum.rub,
                });
            } catch (error) {
                console.error("Error fetching rates:", error);
            }
        };

        fetchRates();
        const interval = setInterval(fetchRates, 60000); // Обновлять каждую минуту

        return () => clearInterval(interval); // Очистка при размонтировании
    }, []);

    return (
        <header className="header">
            <div className="container">
                <div className="header_row">
                    {isAuth && (
                        <NavLink to="/profile">
                            <div className="header_logo">
                                <img src={iconLogo} alt="logo" />
                            </div>
                        </NavLink>
                    )}
                    {!isAuth && (
                        <div className="header_logo">
                            <img src={iconLogo} alt="logo" />
                        </div>
                    )}

                    <nav className="header_nav">
                        <ul>
                            {!isAuth && <Link to="login">Вход</Link>}

                            {!isAuth && <Link to="registration">Регистрация</Link>}

                            {isAuth && (
                                <>
                                    {isAdmin && (
                                        <Link to={"/users"}>
                                            Админ
                                        </Link>
                                    )}
                                    <Link to="/status">
                                        <p
                                            style={{
                                                marginBottom: "0px"
                                            }}
                                        >
                                            {user?.email}
                                        </p>
                                        <span
                                            style={{
                                                fontSize: "8px",
                                                color: "#0000004D",
                                                marginTop: "4px"
                                            }}
                                        >ID {user?.id}</span>
                                    </Link>
                                    <div onClick={() => dispatch(logout())}>Выход</div>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>

                <div className="header_row">
                    <div className="running_line">
                        <div></div>
                        <marquee scrollamount="5">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    gap: '56px',
                                }}
                            >
                                <span>BTC/USD $ {rates.BTC_USD ? rates.BTC_USD.toLocaleString() : "loading..."} (+16%)</span>
                                <span>BTC/RUB ₽ {rates.BTC_RUB ? rates.BTC_RUB.toLocaleString() : "loading..."} (+16%)</span>
                                <span>USDT/RUB ₽ {rates.USDT_RUB ? rates.USDT_RUB.toLocaleString() : "loading..."} (+16%)</span>
                                <span>ETH/USD $ {rates.ETH_USD ? rates.ETH_USD.toLocaleString() : "loading..."} (+16%)</span>
                                <span>ETH/RUB ₽ {rates.ETH_RUB ? rates.ETH_RUB.toLocaleString() : "loading..."} (+16%)</span>
                            </div>
                        </marquee>
                        <div></div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
