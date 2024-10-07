import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { fetchUserInfo } from "../../slices/userInfoSlice";
import GuestHeader from "./GuestHeader";
import ResponsiveHeader from "./ResponsiveHeader";
import SignedInHeader from "./SignedInHeader";
import scan from "../../assets/images/scan-logo-green.png";
import "../../styles/Header.scss";

const Header = () => {
  const dispatch: AppDispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Получить информацию о пользователе если есть токен
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUserInfo(accessToken));
    }
  }, [accessToken, dispatch]);

  return (
    <header className="header">
      <Link to="/">
        <img className="header-logo" src={scan} alt="logo" />
      </Link>
      <nav className="header-nav">
        <Link className="header-nav__link" to="/">
          Главная
        </Link>
        <Link className="header-nav__link" to="#">
          Тарифы
        </Link>
        <Link className="header-nav__link" to="/error">
          FAQ
        </Link>
      </nav>

      {/* Загрузить заголовок в зависимости от токена */}
      {accessToken ? <SignedInHeader /> : <GuestHeader />}
      <ResponsiveHeader />
    </header>
  );
};

export default Header;
