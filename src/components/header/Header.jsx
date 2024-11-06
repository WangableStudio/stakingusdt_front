import "./header.css";

import {Link, NavLink} from "react-router-dom";

import iconLogo from "./../../assets/images/logo.png";
import {useSelector, useDispatch} from "react-redux";
import {logout} from "./../../reducers/userReducer";

//шапка
const Header = () => {
    const isAuth = useSelector((state) => state.user.isAuth);
    const user = useSelector((state) => state.user?.currentUser?.user);
    const dispatch = useDispatch();
    const isAdmin = user?.role === "ADMIN";

    return (
        <header className="header">
            <div className="container">
                <div className="header_row">
                    {isAuth && (
                        <NavLink to="/profile">
                            <div className="header_logo">
                                <img src={iconLogo} alt="logo"/>
                            </div>
                        </NavLink>
                    )}
                    {!isAuth && (
                        <div className="header_logo">
                            <img src={iconLogo} alt="logo"/>
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
                                <span>BTC/USD $52,176.00 (+16%)</span>
                                <span>BTC/RUB ₽4,820,626.66 (+16%)</span>
                                <span>USDT/RUB ₽92.50 (+16%)</span>
                                <span>ETH/USD $2,900.06 (+16%)</span>
                                <span>ETH/RUB ₽268,622.13 (+16%)</span>
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
