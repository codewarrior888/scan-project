import AuthForm from "./AuthForm";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../app/store";
import { loadTokenFromStorage } from "../../slices/authSlice";
import key from "../../assets/images/key.svg";
import "../../styles/Auth.scss";

const Authentication: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(loadTokenFromStorage());

    if (accessToken) {
      navigate("/");
    }
  }, [dispatch, accessToken, navigate]);

  return (
    <div className="authorization">
      <h2 className="authorization__title">
        Для оформления подписки на тариф, необходимо авторизоваться.
      </h2>
      <img className="authorization__image" src={key} alt="key" />
      <AuthForm />
    </div>
  );
};

export default Authentication;
