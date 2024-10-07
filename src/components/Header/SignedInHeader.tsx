import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../app/store";
import { logout } from "../../slices/authSlice";
import { fetchUserInfo } from "../../slices/userInfoSlice";
import Loader from "../Loader/Loader";
import avatar from "../../assets/images/avatar-default.svg";
import "../../styles/SignedInHeader.scss";

const SignedInHeader = () => {
  const dispatch: AppDispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const userInfo = useSelector((state: RootState) => state.user);
  const isUserInfoLoading = useSelector(
    (state: RootState) => state.user.isLoading
  );
  const login = localStorage.getItem("login");

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUserInfo(accessToken));
    }
  }, [accessToken, dispatch]);

  return (
    <div className="signed">
      <div className="user-info__wrapper">
        {isUserInfoLoading ? (
          <Loader />
        ) : (
          <>
            <p className="companies-info">
              Использовано компаний
              <span className="companies-used">{userInfo.used}</span>
            </p>
            <p className="companies-info">
              Лимит по компаниям
              <span className="companies-used companies-used__limit">
                {userInfo.limit}
              </span>
            </p>
          </>
        )}
      </div>
      <div className="user-info">
        <span className="username">{login}</span>
        <button
          className="logout"
          onClick={() => {
            dispatch(logout());
            localStorage.clear();
          }}
        >
          <Link className="header-nav__link" to="/">
            Выйти
          </Link>
        </button>
      </div>
      <img className="user-avatar" src={avatar} alt="user avatar" />
    </div>
  );
};

export default SignedInHeader;
