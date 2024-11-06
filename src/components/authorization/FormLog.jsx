import "./form.css";
import closeBut from "./../../assets/images/close.png";
import React from "react";
import Input from "../input/Input";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { givecode, login } from "./../action/user";
import { setUser } from "../../reducers/userReducer";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { BsEyeSlash, BsEye } from "react-icons/bs";

const FormLog = () => {
    const navigate = useNavigate();
    const [tel, setTel] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const isAuth = useSelector((state) => state.user.isAuth);
    const [code, setCode] = useState(true)
    const [codeInp, setCodeInp] = useState('')
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await login(tel, email, password, codeInp)
            console.log(data);
            dispatch(setUser(data));
            localStorage.setItem("accessToken", data.token);
            navigate("/status");
        } catch (e) {
            if (e instanceof AxiosError) {
                if (e.response?.data?.errors?.errors) {
                    e.response?.data?.errors?.errors?.forEach((error) => {
                        toast.error(`${error?.path}: ${error?.msg}`);
                    })
                } else {
                    toast.error(e.response?.data?.message);
                }
            } else {
                toast.error(e.message);
            }
        } finally {
            setLoading(false);
        }
    }
    const giveCode = async (e) => {
        e.preventDefault();
        setLoading(true)
        try{
            const data = await givecode(email)
            setCode(false)
        }catch(e){
            toast.error(e.message);
        } finally{
            setLoading(false)
        }
    }

    return (
        <div className="form">
            <div className="form_content active">
                <div className="form_container">
                    <NavLink to="/">
                        <div className="close_button">
                            <img src={closeBut} alt="text" />
                        </div>
                    </NavLink>

                    <p className="title_form">Вход</p>
                    <form onSubmit={code ? giveCode : handleSubmit} method="POST" action="/">

                        <div className="content_form">
                            <div className="title_input">
                                <ul>
                                    <li>Телефон</li>
                                    <Input value={tel} setValue={setTel} type="tel" />
                                </ul>

                                <ul>
                                    <li>E-mail</li>
                                    <Input value={email} setValue={setEmail} type="email" />
                                </ul>

                                <ul>
                                    <li>Пароль</li>
                                    <Input
                                        value={password}
                                        setValue={setPassword}
                                        className="pass"
                                        type={passwordVisible ? 'text' : 'password'}
                                        required
                                    />
                                    {passwordVisible ? (
                                        <BsEyeSlash style={{ cursor: 'pointer' }} onClick={togglePasswordVisibility} />
                                    ) : (
                                        <BsEye style={{ cursor: 'pointer' }} onClick={togglePasswordVisibility} />
                                    )}
                                </ul>
                                <ul>
                                    <li>Код для потверждения</li>
                                    <Input value={codeInp} setValue={setCodeInp} type="text" />
                                </ul>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="loginButton_form"
                            disabled={loading}
                        >
                            <p>{code ? 'Потвердить Email' : 'Вход'}</p>
                        </button>

                        <div className="descr_form">
                            <p>
                                Еще не зарегистрированы?<Link to="/registration"> Зарегистрироваться</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default FormLog;
