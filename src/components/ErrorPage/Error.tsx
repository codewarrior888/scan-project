import { Link } from "react-router-dom";
import "../../styles/Error.scss";

export default function Error() {
  return (
    <div className="error">
      <h1 className="error__title">404</h1>
      <p className="error__subtitle">
        Мы работаем над этой страницей! <br />
        Вернитесь пока на <Link to="/">Главную</Link>
      </p>
    </div>
  );
}
