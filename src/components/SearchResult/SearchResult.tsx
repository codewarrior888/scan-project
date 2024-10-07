import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../app/store";
import { checkToken, loadTokenFromStorage } from "../../slices/authSlice";
import SummarySlider from "./SummarySlider";
import Documents from "./Documents";
import Loader from "../../components/Loader/Loader";
import searchResultImg from "../../assets/images/search-result-image.svg";
import "../../styles/SearchResult.scss";

const SearchResult: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadTokenFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (accessToken) {
      dispatch(checkToken);
    }
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (!accessToken) {
      navigate("/auth");
    }
  }, [accessToken, navigate]);

  const isLoading = useSelector(
    (state: RootState) => state.histogram.isLoading
  );
  const error = useSelector((state: RootState) => state.histogram.error);

  useEffect(() => {
    if (!accessToken) {
      navigate("/auth");
    }
  }, [accessToken, navigate, dispatch]);

  return (
    <div className="search-result">
      <div className="search-result__top">
        <div>
          <h1 className="search-result__title">
            {isLoading ? "Ищем. Скоро будут результаты." : "Результаты поиска"}
          </h1>
          {isLoading ? (
            <p className="search-result__subtitle">
              Поиск может занять некоторое время, <br />
              просим сохранять терпение.
            </p>
          ) : (
            <p className="search-result__subtitle">
              По вашему запросу найдены <br /> следующие данные.
            </p>
          )}
        </div>
        <img
          src={searchResultImg}
          className="search-result__img"
          alt="search result"
        />
      </div>

      {error ? (
        <p className="search-result__error search-result__error--info">
          Что-то пошло не так : <br />
          Попробуйте <Link to="/search">изменить параметры поиска</Link>
        </p>
      ) : (
        <div>
          {error ? (
            <div className="slider-loader">
              <Loader />
              <p className="loading-data">Загружаем данные</p>
            </div>
          ) : (
            <SummarySlider />
          )}
          <Documents />
        </div>
      )}
    </div>
  );
};

export default SearchResult;
