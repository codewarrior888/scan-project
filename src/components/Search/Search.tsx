import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadTokenFromStorage } from "../../slices/authSlice";
import Loader from "../Loader/Loader";
import SearchForm from "./SearchForm";
import searchImg from "../../assets/images/search-img.svg";
import document from "../../assets/images/document.svg";
import folders from "../../assets/images/folders.svg";
import "../../styles/Search.scss";

const Search: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadTokenFromStorage());
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && !accessToken) {
      navigate("/auth");
    }
  }, [isLoading, accessToken, navigate]);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="search">
      <div className="search__top-section">
        <h1 className="search__top-section search__top-section--title">
          Найдите необходимые данные в пару кликов.
        </h1>
      </div>
      <div className="search__middle-section">
        <p className="search__middle-section search__middle-section--subtitle">
          Задайте параметры поиска. <br />
          Чем больше заполните, тем точнее поиск.
        </p>
        <img
          src={document}
          alt="document"
          className="search__middle-section search__middle-section--doc-img"
        />
        <img
          src={folders}
          alt="folders"
          className="search__middle-section search__middle-section--folders-img"
        />
      </div>
      <div className="search__bottom-section">
        <SearchForm />
        <img
          src={searchImg}
          alt="a man searching"
          className="search__bottom-section search__bottom-section--search-img"
        />
      </div>
    </div>
  );
};

export default Search;
