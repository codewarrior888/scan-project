import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../app/store";
import { logout } from "../../slices/authSlice";
import { fetchUserInfo } from "../../slices/userInfoSlice";
import scan from "../../assets/images/scan-logo-white.png";
import avatar from "../../assets/images/avatar-default.svg";
import "../../styles/ResponsiveHeader.scss";

const ResponsiveHeader = () => {
  const [isActive, setActive] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const login = localStorage.getItem("login") || "Guest";

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUserInfo(accessToken));
    }
  }, [accessToken, dispatch]);

  const handleClick = () => {
    setActive(false);
  };

  return (
    <div className={`responsive-button__open ${isActive ? "menu-open" : ""}`}>
      <div
        className="responsive-button__open"
        onClick={() => setActive(true)}
      ></div>
      {isActive && (
        <div className="responsive-menu">
          <div className="responsive-top">
            <img className="responsive-logo" src={scan} alt="logo" />
            <button
              className="responsive-button__close"
              onClick={(e) => {
                e.stopPropagation();
                setActive(false);
              }}
            ></button>
          </div>
          <nav className="responsive-nav">
            <Link className="responsive-nav__link" to="/" onClick={handleClick}>
              Главная
            </Link>
            <Link className="responsive-nav__link" to="#" onClick={handleClick}>
              Тарифы
            </Link>
            <Link
              className="responsive-nav__link"
              to="/error"
              onClick={handleClick}
            >
              FAQ
            </Link>
          </nav>
          {accessToken ? (
            <div className="responsive__user-info">
              <span className="responsive__username">{login}</span>
              <img
                className="responsive__user-avatar"
                src={avatar}
                alt="user avatar"
              />
              <button
                className="responsive__logout"
                onClick={() => {
                  dispatch(logout());
                  localStorage.clear();
                  handleClick();
                }}
              >
                <Link to="/">Выйти</Link>
              </button>
            </div>
          ) : (
            <div className="responsive__not-signed">
              <Link
                className="responsive__sign-up"
                to="#"
                onClick={handleClick}
              >
                Зарегистрироваться
              </Link>
              <Link
                className="responsive__sign-in"
                to="/auth"
                onClick={handleClick}
              >
                Войти
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResponsiveHeader;
