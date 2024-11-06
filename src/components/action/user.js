import axios from "axios";
import { setLoading, setUser } from "../../reducers/userReducer";
import { API_URL } from "../../http";

export const givecode = async (
  email
) => {
  const { data } = await axios.post(`${API_URL}/api/auth/give-code`, {
    email
  });
  return data;
}

export const registration = async (
  tel,
  email,
  password,
  secretWord,
  firstName,
  lastName,
  surName,
  referal,
  code
) => {
    const { data } = await axios.post(`${API_URL}/api/auth/registration`, {
      tel,
      email,
      password,
      secretWord,
      referal,
      firstName,
      lastName,
      surName,
      code
    });
    return data;
};

export const login = async (tel, email, password, code) => {
  const { data } = await axios.post(`${API_URL}/api/auth/login`, {
    tel,
    email,
    password,
    code
  });
  return data;
};

export const auth = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/auth`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      localStorage.setItem("accessToken", response.data.token);
      dispatch(setUser(response.data));
      
      //получаем нашего юзера и переменную, которая показывает, авторизован ли пользователь

      //локальное хранилище для токена, чтобы при обновлении страницы не слетала авторизация
    } catch (e) {
      localStorage.removeItem("accessToken");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const getUserInfo = () => {
 return async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      dispatch(setUser(response.data.user));
    } catch (e) {
      console.error(e);
      // Обработка ошибок, например, удаление токена из локального хранилища, если запрос не удался
      localStorage.removeItem("accessToken");
    }
  };
};
