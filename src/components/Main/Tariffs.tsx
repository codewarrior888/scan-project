import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { checkToken } from "../../slices/authSlice";
import beginner from "../../assets/images/tariff-beginner.svg";
import pro from "../../assets/images/tariff-pro.svg";
import business from "../../assets/images/tariff-business.svg";
import checkImg from "../../assets/images/check-mark.svg";
import "../../styles/Tariffs.scss";

const Tariffs = () => {
  const dispatch: AppDispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (accessToken) {
      dispatch(checkToken);
    }
  }, [accessToken, dispatch]);

  // Симулировать получение текущего тарифа (по умолчанию задан тариф 2, в будущем получить через API )
  const [currentTariffId, setCurrentTariffId] = useState<number>(2);

  const tariffs = [
    {
      className: "tariff-beginner",
      id: 1,
      title: "Beginner",
      image: beginner,
      description: "Для небольшого исследования",
      price: "1 200 ₽",
      discount: "799 ₽",
      installment: "или 150 ₽/мес. при рассрочке на 24 мес.",
      details: {
        detail1: "Безлимитная история запросов",
        detail2: "Безопасная сделка",
        detail3: "Поддержка 24/7",
      },
    },
    {
      className: "tariff-pro",
      id: 2,
      title: "Pro",
      image: pro,
      description: "Для HR и фрилансеров",
      price: "2 600 ₽",
      discount: "1 299 ₽",
      installment: "или 279 ₽/мес. при рассрочке на 24 мес.",
      details: {
        detail1: "Все пункты тарифа Beginner",
        detail2: "Экспорт истории",
        detail3: "Рекомендации по приоритетам",
      },
    },
    {
      className: "tariff-business",
      id: 3,
      title: "Business",
      image: business,
      description: "Для корпоративных клиентов",
      price: "3 700 ₽",
      discount: "2 379 ₽",
      installment: "",
      details: {
        detail1: "Все пункты тарифа Pro",
        detail2: "Безлимитное количество запросов",
        detail3: "Приоритетная поддержка",
      },
    },
  ];

  const tariffCards = tariffs.map((item) => {
    const isCurrentTariff = accessToken && item.id === currentTariffId;

    return (
      <div className="tariff" key={item.id}>
        <div className={`tariff__header ${item.className}`}>
          <div className="tariff__header--description">
            <p className="tariff__header--title">{item.title}</p>
            <p className="tariff__header--subtitle">{item.description}</p>
          </div>
          <img
            className="tariff__header--img"
            alt={`${item.title} icon`}
            src={item.image}
          />
        </div>
        <div
          className={`tariff-body ${
            isCurrentTariff ? `tariff-body__current--${item.id}` : ""
          }`}
        >
          <span className={isCurrentTariff ? "current" : "current-disabled"}>
            {isCurrentTariff ? "Текущий тариф" : ""}
          </span>
          <div className="tariff-price__container">
            <p className="tariff-price__price">{item.price}</p>
            <p className="tariff-price__discount">{item.discount}</p>
          </div>
          <p className="tariff-price__installment">{item.installment}</p>
          <p className="tariff-details__title">В тариф входит:</p>
          <ul className="tariff-details__list">
            <li className="tariff-details">
              <img className="tariff-details__check" src={checkImg} alt="" />
              {item.details.detail1}
            </li>
            <li className="tariff-details">
              <img className="tariff-details__check" src={checkImg} alt="" />
              {item.details.detail2}
            </li>
            <li className="tariff-details">
              <img className="tariff-details__check" src={checkImg} alt="" />
              {item.details.detail3}
            </li>
          </ul>
          <button
            className={`tariff-button ${
              isCurrentTariff ? "tariff-button__current" : ""
            }`}
          >
            <Link to="#">
              {isCurrentTariff ? "Перейти в личный кабинет" : "Подробнее"}
            </Link>
          </button>
        </div>
      </div>
    );
  });

  return <div className="tariffs">{tariffCards}</div>;
};

export default Tariffs;
