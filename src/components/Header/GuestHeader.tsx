import { Link } from "react-router-dom";
import "../../styles/GuestHeader.scss";

const GuestHeader = () => {
  return (
    <div className="not-signed">
      <Link className="sign-up" to="#">
        Зарегистрироваться
      </Link>
      <div className="line"></div>
      <Link className="sign-in" to="/auth">
        Войти
      </Link>
    </div>
  );
};

export default GuestHeader;
