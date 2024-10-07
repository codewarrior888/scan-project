import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { loadTokenFromStorage } from "../../slices/authSlice";
import MainSlider from "./MainSlider";
import Tariffs from "./Tariffs";
import mainImg from "../../assets/images/main-top-img.svg";
import "../../styles/Main.scss";

const Main = () => {
  const dispatch: AppDispatch = useDispatch();
  const { accessToken, isAuthError } = useSelector(
    (state: RootState) => state.auth
  );

  // Загрузить токен из localStorage
  useEffect(() => {
    dispatch(loadTokenFromStorage());
  }, [dispatch]);

  return (
    <div className="main">
      <section className="main__section main__section--top">
        <div>
          <h1 className="main__title">
            Сервис по поиску
            <br />
            публикаций
            <br /> о компании
            <br /> по ее ИНН
          </h1>
          <p className="main__subtitle">
            Комплексный анализ публикаций, получение данных в формате PDF на
            электронную почту.
          </p>
          {/* Кнопка запроса данных отображается только при наличии токена */}
          {accessToken && (
            <Link to="/search" className="main__request-button">
              Запросить данные
            </Link>
          )}

          {isAuthError && (
            <p className="main__error">
              Ошибка загрузки токена из localStorage. Проверьте ваши настройки,
              например, если у Вас приватная сессия в браузере.
            </p>
          )}
        </div>
        <div className="main__section--top img">
          <img
            className="main__section--top__img"
            src={mainImg}
            alt="main page"
          />
        </div>
      </section>
      <section className="main__section main__section--middle">
        <h2 className="main__title">Почему именно мы</h2>
        <div className="main__slider ">
          <MainSlider />
        </div>
        <div className="main__section--middle__img"></div>
      </section>
      <section className="main__section main__section--bottom">
        <h2 className="main__title">Наши тарифы</h2>
        <Tariffs />
      </section>
    </div>
  );
};

export default Main;
