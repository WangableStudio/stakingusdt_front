import './form.css'
import closeBut from './../../assets/images/close.png'
import React from 'react';
import Input from '../input/Input';
import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { givecode, registration } from '../action/user';
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import InputMask from 'react-input-mask';
import { BsEyeSlash, BsEye } from "react-icons/bs";

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const FormReg = () => {
    const navigate = useNavigate();
    const [fName, setfName] = useState('')
    const [sName, setsName] = useState('')
    const [tName, settName] = useState('')
    const [tel, setTel] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [secretWord, setSecret_word] = useState('')
    const [code, setCode] = useState(true)
    const [codeInp, setCodeInp] = useState('')
    const query = useQuery().get("ref");

    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await registration(tel, email, password, secretWord, fName, sName, tName, query, codeInp);
            navigate("/login");
            toast.success("Registration successful");
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
        try {
            const data = await givecode(email)
            setCode(false)
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false)
        }
    }

    return (

        <div className="form">
            <div className="form_content active">
                <div className="form_container">
                    <form onSubmit={code ? giveCode : handleSubmit} method="POST" action="/">
                        <NavLink to='/'>
                            <div className='close_button'>
                                <img src={closeBut} alt="text" />
                            </div>
                        </NavLink>

                        <p className='title_form'>Регистрация</p>
                        <p className='title_form_descr'>Данные должны соответствовать реальным данным, указанным в
                            паспорте.
                            После введения данных, обязательно проверьте их правильность. Редактирование персональных
                            данных
                            возможно только через менеджера. Ручное редактирование невозможно.</p>
                        <div className="content_form">
                            <div className='title_input'>
                                <ul>
                                    <li>Имя</li>
                                    <Input value={fName} setValue={setfName} type='fName' />

                                </ul>
                                <ul>
                                    <li>Фамилия</li>
                                    <Input value={sName} setValue={setsName} type='sName' />

                                </ul>
                                <ul>
                                    <li>Отчество</li>
                                    <Input value={tName} setValue={settName} type='tName' />
                                </ul>

                                <ul>
                                    <li>Телефон</li>
                                    <InputMask
                                        className='input_'
                                        mask="+7 (999) 999-99-99"
                                        value={tel}
                                        onChange={(e) => setTel(e.target.value)}
                                        type='tel'
                                        required
                                    />
                                </ul>

                                <ul>
                                    <li>E-mail</li>
                                    <Input value={email} setValue={setEmail} type='email' required />
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
                                    <li>Секретное слово</li>
                                    <Input value={secretWord} setValue={setSecret_word} type='secretWord' />
                                </ul>
                                <ul>
                                    <li>Код для потверждения</li>
                                    <Input value={codeInp} setValue={setCodeInp} type='text' required />
                                </ul>

                                {/*<ul>*/}
                                {/*    <li>Рефераль<br/>ный код</li>*/}
                                {/*    <Input value={referalCode} setValue={setRef_code} type='referalCode'/>*/}

                                {/*</ul>*/}

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="loginButton_form"
                            disabled={loading}
                        >
                            <p>{code ? 'Потвердить Email' : 'Зарегестрироваться'}</p>
                        </button>
                    </form>
                    <div className='descr_form'>
                        <p>Нажимая на кнопку 'Зарегистрироваться', Вы даете свое согласие на обработку персональных
                            данных в соответствии с <a href='#!'>Политикой в отношении обработки персональных данных</a>
                        </p>
                    </div>

                    <div className='descr_form'>
                        <p>Уже зарегистрированы?<Link to='/login'> Войти</Link></p>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default FormReg;








