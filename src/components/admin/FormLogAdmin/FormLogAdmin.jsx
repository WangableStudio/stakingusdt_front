import "./../../authorization/form.css";
import closeBut from "./../../../assets/images/close.png";
import React from "react";

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./../../action/user";
import Input from "./../../input/Input"
const FormLog = () => {
  const navigate = useNavigate();
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isAuth = useSelector((state) => state.user.isAuth);
  const dispatch = useDispatch();

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
                  type="password"
                />
              </ul>
            </div>
          </div>
            <NavLink to='users'>
          <div
            className="loginButton_form"
           
          >
            <p>Вход</p>
          </div>
          </NavLink>

          <div className="descr_form">
            <p>
              Еще не зарегистрированы?<a href="#!"> Зарегистрироваться</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FormLog;