import "./navbar.css";
import { NavLink } from "react-router-dom";

function NavBar() {
  //лого + ссылки + бегущая строка
  return (
    <div className="header_nav">
      <div className="nav_bar">
        <NavLink to="status">
          <div className="nav_cont">Пользователи</div>
        </NavLink>

        <NavLink to="history">
          <div className="nav_cont">Заявки на ввод вывод</div>
        </NavLink>
        <NavLink to="/">
        <div className="nav_cont">Банк</div>
        </NavLink>
      </div>
    </div>
  );
}
export default NavBar;
