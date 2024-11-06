import './../footer/footer.css'
import { NavLink } from "react-router-dom";
//шапка
const Footer= ()=>{
    
    //лого + ссылки + бегущая строка
    return(
        <footer className='footer'>
            <div className="container">
            
                {/* <span>Политика конфиденциальности</span>
                <span>Оферта </span>
                <span>Полезные материалы</span>
                <span>2024 © nextcryptoinvest.com</span>
                <span>Вход для администратора</span> */}

                 <ul>
                    <li>Политика конфиденциальности</li>
                    <li>Оферта</li>
                    <li>Полезные материалы</li>
                    <li>2024 © nextcryptoinvest.com</li>
                    {/* <NavLink to='/loginadmin'>
                        <li>Вход для администратора</li>
                    </NavLink> */}
                </ul> 
            </div>
            

        </footer>
    )


}
export default Footer;