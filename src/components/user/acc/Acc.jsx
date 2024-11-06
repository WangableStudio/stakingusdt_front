import { useEffect } from "react";
import "./acc.css";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "./../../action/user";



//шапка
function PartnerAcc() {
  const info = useSelector((state) => state?.user?.currentUser?.user);
  //лого + ссылки + бегущая строка
  const dispatch = useDispatch();
  function findValueByKey(key) {
    return info?.hasOwnProperty(key) ? info[key] : "-";
  }
  console.log(info, "info");
  return (
    <body>
      <div className="container container_acc">
        <div className="title">Личный кабинет</div>
        <div className="main_con">
          <div className="column_info">
            <div className="container_info">
              <div className="title_contact_info">Контактная информация</div>
              <div className="information_block">
                <div className="row">
                  <div className="row_item">ID</div>
                  <div className="row_item">{findValueByKey("id")}</div>
                </div>
                <div className="row mt24">
                  <div className="row_item">Фамилия</div>
                  <div className="row_item">{findValueByKey("lname")}</div>
                </div>
                <div className="row">
                  <div className="row_item">Имя</div>
                  <div className="row_item">{findValueByKey("name")}</div>
                </div>
                <div className="row">
                  <div className="row_item">Отчество</div>
                  <div className="row_item">{findValueByKey("tname")}</div>
                </div>
                <div className="row mt24">
                  <div className="row_item">Дата рождения</div>
                  <div className="row_item">{findValueByKey("date")}</div>
                </div>
                <div className="row mt24">
                  <div className="row_item">Телефон</div>
                  <div className="row_item">{findValueByKey("tel")}</div>
                </div>
                <div className="row">
                  <div className="row_item">E-mail</div>
                  <div className="row_item">{findValueByKey("email")}</div>
                </div>
                <div className="row">
                  <div className="row_item">Telegram</div>
                  <div className="row_item">{findValueByKey("telegram")}</div>
                </div>
                <div className="row">
                  <div className="row_item">WhatsApp</div>
                  <div className="row_item">{findValueByKey("WhatsApp")}</div>
                </div>
              </div>

              <div className="button mt20">Запросить изменение информации</div>
            </div>
          </div>
          <div className="column">
            <div className="column_info_2">
              <div className="title_contact_info">Верификация</div>
              <div className="description_bottom">
                <p className="description_bottom_text">
                  <br />
                  Для подтверждения личности Вам необходимо отправить следующие
                  <br /> документы и фото на почту nextcryptoinvest@gmail.com
                  или в
                  <br />
                  Телеграм-аккаунт @nextcryptoinvest_bot:
                </p>
                <p className="description_bottom_text">
                  <br />
                  Серия и номер паспорта,
                  <br />
                  Ваше фото с паспортом, где четко видно лицо и данные в
                  паспорте
                  <br />
                  <a href="#!" className="blue_word">
                    (пример).
                  </a>
                </p>
                <p className="description_bottom_text">
                  <br />
                  Если данные, указанные при регистрации, не будут совпадать с
                  <br />
                  паспортными данными, мы не сможем верифицировать Ваш аккаунт в
                  <br />
                  целях безопасности. Благодарим за понимание.
                </p>
              </div>
              <div className="button">Я отправил(-а) документы, подать заявку</div>
              <div className="description_bottom_partn">
                <p>
                  При возникновении вопросов, связанных с изменением личных
                  данных,
                  <br />
                  верификацией аккаунта и секретным словом, пишите нам на почту
                  –
                  <br />
                  nextcryptoinvest@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}

export default PartnerAcc;
