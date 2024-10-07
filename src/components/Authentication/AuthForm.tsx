import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { loginAsync } from "../../slices/authSlice";
import { useLoginFormValidator } from "./useLoginFormValidator";
import lock from "../../assets/images/lock.svg";
import google from "../../assets/images/google.svg";
import facebook from "../../assets/images/facebook.svg";
import yandex from "../../assets/images/yandex.svg";
import "../../styles/AuthForm.scss";

interface FormState {
  login: string;
  password: string;
}

const AuthForm: React.FC = () => {
  const [form, setForm] = useState<FormState>({ login: "", password: "" });
  const dispatch: AppDispatch = useDispatch();
  const { isAuthError, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const { errors, validateForm, onBlurField } = useLoginFormValidator(form);

  const onUpdateField = (e: ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name as keyof FormState;
    const nextFormState = { ...form, [field]: e.target.value };
    setForm(nextFormState);

    // Очистка ошибок при изменении формы
    if (isAuthError) dispatch({ type: "auth/resetAuthError" });

    // Валидация при изменении формы
    if (errors[field].dirty) {
      validateForm({ form: nextFormState, errors, field });
    }
  };

  const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { isValid } = validateForm({ form, errors, forceTouchErrors: true });
    if (!isValid) return;

    try {
      await dispatch(
        loginAsync({ login: form.login, password: form.password })
      );
      setForm({ login: "", password: "" });
    } catch (error) {
      console.error("Ошибка аутентификации:", error);
      dispatch({
        type: "auth/loginFailed",
        payload: "Попытка аутентификации не удалась. Попробуйте ещё раз.",
      });
    }
  };

  return (
    <form className="form" onSubmit={onSubmitForm}>
      <img className="form__img--lock" src={lock} alt="lock icon" />

      <div className="form__links">
        <button className="form__link">
          <Link to="/auth">Войти</Link>
        </button>
        <button className="form__link form__link--disabled">
          <Link to="#">Зарегистрироваться</Link>
        </button>
      </div>

      <label className="form__label">
        Логин или номер телефона:
        <input
          className={`form__input ${
            errors.login.dirty && errors.login.error ? "form__input--error" : ""
          }`}
          type="text"
          name="login"
          value={form.login}
          onChange={onUpdateField}
          onBlur={onBlurField}
        />
        {errors.login.dirty && errors.login.error && (
          <p className="form__input-error">{errors.login.message}</p>
        )}
        {isAuthError && (
          <p className="form__error-message">Введите корректные данные</p>
        )}
      </label>

      <label className="form__label">
        Пароль:
        <input
          className={`form__input ${
            errors.password.dirty && errors.password.error
              ? "form__input--error"
              : ""
          }`}
          type="password"
          name="password"
          value={form.password}
          onChange={onUpdateField}
          onBlur={onBlurField}
        />
        {errors.password.dirty && errors.password.error && (
          <p className="form__input-error">{errors.password.message}</p>
        )}
        {isAuthError && (
          <p className="form__error-message">Введите корректные данные</p>
        )}
      </label>

      {/* Кнопка неактивна при ошибке валидации или при загрузке данных */}
      <button
        type="submit"
        className="form__button--submit"
        disabled={isLoading || !form.login || !form.password}
      >
        {isLoading ? "Выполняется вход..." : "Войти"}
      </button>

      <Link className="form__reset-password" to="#">
        Восстановить пароль
      </Link>

      <p className="form__signin-with">Войти через:</p>
      <div className="form__social-icons">
        <img src={google} alt="Google logo" />
        <img src={facebook} alt="Facebook logo" />
        <img src={yandex} alt="Yandex logo" />
      </div>
    </form>
  );
};

export default AuthForm;
