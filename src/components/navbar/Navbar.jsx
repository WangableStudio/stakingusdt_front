import { NavLink } from "react-router-dom";
import "./navbar.css";

function NavBar() {
  return (
    <div className="header_nav">
      <div className="nav_bar">
        <NavLink to="/status">
          <p className="nav_cont">Cостояние счета</p>
        </NavLink>

        <NavLink to="/history">
          <p className="nav_cont">История транзакций</p>
        </NavLink>
        <NavLink to="/refferals">
          <p className="nav_cont">Реферальная программа</p>
        </NavLink>
      </div>
    </div>
  );
}
export default NavBar;
