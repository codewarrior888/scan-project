import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import {
  setInn,
  setLimit,
  setSearchFormChecks,
  setStartDate,
  setEndDate,
  setTonality,
} from "../../slices/searchSlice";
import { fetchHistogramData } from "../../slices/histogramSlice";
import { fetchIds } from "../../slices/idsSlice";
import DatePicker from "react-datepicker";
import { selectSearchDates } from "./selectors";

import "react-datepicker/dist/react-datepicker.min.css";
import "../../styles/SearchForm.scss";

interface SearchFormData {
  inn: string;
  limit: number;
  tonality: string;
}

const SearchForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  // Convert timestamps to Date objects for use in the DatePicker; memoized selector
  const { startDate, endDate } = useSelector(selectSearchDates);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SearchFormData>({
    mode: "onBlur",
    defaultValues: {},
  });

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (!accessToken) {
      navigate("/auth");
    }
  }, [accessToken, navigate]);

  // Utility function to format date
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Use hyphens
  };

  const onSubmit = (data: SearchFormData) => {
    const formattedStartDate = startDate ? formatDate(startDate) : null;
    const formattedEndDate = endDate ? formatDate(endDate) : null;

    dispatch(setStartDate(formattedStartDate)); // Serialize the date
    dispatch(setEndDate(formattedEndDate)); // Serialize the date
    dispatch(setInn(data.inn));
    dispatch(setTonality(data.tonality));
    dispatch(setLimit(data.limit));

    dispatch(fetchHistogramData(accessToken));
    dispatch(fetchIds(accessToken));
    navigate("/result");
  };

  return (
    <form className="search-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="search-form__inputs">
        <label className="search-form__label">
          ИНН компании *
          <input
            className={
              errors?.inn
                ? "search-form__input search-form__input-invalid"
                : "search-form__input"
            }
            placeholder="10 цифр"
            {...register("inn", {
              required: "Обязательное поле",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Введите корректные данные",
              },
            })}
          />
          {errors?.inn && (
            <p className="search-form__error-message">{errors.inn.message}</p>
          )}
        </label>
        <label className="search-form__label">
          Тональность
          <select
            className="search-form__input"
            {...register("tonality", { required: "Обязательное поле" })}
            onChange={(e) => {
              dispatch(setTonality(e.target.value));
            }}
          >
            <option value={"any"}>Любая</option>
            <option value={"positive"}>Позитивная</option>
            <option value={"negative"}>Негативная</option>
          </select>
        </label>
        <label className="search-form__label">
          Количество документов в выдаче *
          <input
            type="number"
            className={
              errors?.limit
                ? "search-form__input search-form__input-invalid"
                : "search-form__input"
            }
            placeholder="От 1 до 1000"
            {...register("limit", {
              required: "Обязательное поле",
              min: { value: 1, message: "Не менее 1" },
              max: { value: 1000, message: "Не более 1000" },
            })}
          />
          {errors?.limit && (
            <p className="search-form__error-message">{errors.limit.message}</p>
          )}
        </label>
        <div className="date-picker__wrapper">
          <p className="search-form__label">Диапазон поиска *</p>
          <div className="date-picker">
            <div className="date-picker__label">
              <DatePicker
                className="search-form__input dates"
                id="startDate"
                name="startDate"
                placeholderText="Дата начала"
                required
                selectsStart
                startDate={startDate}
                dateFormat="dd/MM/yyyy"
                selected={startDate}
                maxDate={endDate}
                onChange={(date: Date | null) => {
                  if (date) {
                    const formattedDate = date.toISOString().split("T")[0];
                    dispatch(setStartDate(formattedDate)); // Convert to ISO string
                  }
                }}
                fixedHeight
                showYearDropdown
              />
            </div>
            <div className="date-picker__label">
              <DatePicker
                className="search-form__input dates"
                id="endDate"
                name="endDate"
                startDate={startDate}
                placeholderText="Дата конца"
                required
                selectsEnd
                dateFormat="dd/MM/yyyy"
                selected={endDate}
                minDate={startDate}
                maxDate={new Date()}
                onChange={(date: Date | null) => {
                  if (date) {
                    const formattedDate = date.toISOString().split("T")[0];
                    dispatch(setEndDate(formattedDate)); // Convert to ISO string
                  }
                }}
                fixedHeight
                showYearDropdown
              />
            </div>
          </div>
        </div>
      </div>
      <div className="search-form__checks-wrapper">
        <div className="search-form__checks">
          <div className="search-form__check">
            <input
              id="fullness"
              type="checkbox"
              onChange={() => dispatch(setSearchFormChecks("isFullness"))}
            />
            <label htmlFor="fullness" className="checks-label">
              Признак максимальной полноты
            </label>
          </div>
          <div className="search-form__check">
            <input
              id="business"
              type="checkbox"
              onChange={() => dispatch(setSearchFormChecks("isBusiness"))}
            />
            <label htmlFor="business" className="checks-label">
              Упоминания в бизнес-контексте
            </label>
          </div>
          <div className="search-form__check">
            <input
              id="main-role"
              type="checkbox"
              onChange={() => dispatch(setSearchFormChecks("isMainRole"))}
            />
            <label htmlFor="main-role" className="checks-label">
              Главная роль в публикации
            </label>
          </div>
          <div className="search-form__check">
            <input
              id="risk"
              type="checkbox"
              onChange={() => dispatch(setSearchFormChecks("isRisksOnly"))}
            />
            <label htmlFor="risk" className="checks-label">
              Публикации только с риск-факторами
            </label>
          </div>
          <div className="search-form__check">
            <input
              id="tech-news"
              type="checkbox"
              onChange={() => dispatch(setSearchFormChecks("isTechNews"))}
            />
            <label htmlFor="tech-news" className="checks-label">
              Включать технические новости рынков
            </label>
          </div>
          <div className="search-form__check">
            <input
              id="announcement"
              type="checkbox"
              onChange={() => dispatch(setSearchFormChecks("isAnnouncement"))}
            />
            <label htmlFor="announcement" className="checks-label">
              Включать анонсы и календари
            </label>
          </div>
          <div className="search-form__check">
            <input
              id="news"
              type="checkbox"
              onChange={() => dispatch(setSearchFormChecks("isNews"))}
            />
            <label htmlFor="news" className="checks-label">
              Включать сводки новостей
            </label>
          </div>
        </div>
        <div className="search-form__button">
          <button
            disabled={!isValid}
            className="search-form__button search-form__button--submit"
            type="submit"
          >
            Поиск
          </button>
          <p className="required-info">* Обязательные к заполнению поля</p>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
