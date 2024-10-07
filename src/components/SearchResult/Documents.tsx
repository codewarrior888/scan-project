import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../app/store";
import { fetchDocuments, clearDocuments } from "../../slices/documentsSlice";
import Document from "./Document";
import Loader from "../Loader/Loader";
import "../../styles/Documents.scss";

const Documents = () => {
  const dispatch: AppDispatch = useDispatch();
  const { documents, isLoading, error } = useSelector(
    (state: RootState) => state.documents
  );
  const ids = useSelector((state: RootState) => state.ids.ids);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    // Перезапросить документы при изменении параметров поиска
    if (ids.length > 0) {
      dispatch(clearDocuments());
      dispatch(
        fetchDocuments({
          accessToken: accessToken,
          ids: ids.slice(0, 10), // Загрузить первые 10 документов
        })
      );
      setOffset(10);
    }
  }, [dispatch, ids]);

  const loadMoreDocuments = () => {
    const accessToken = localStorage.getItem("accessToken");

    // Загрузить следующие 10 документов
    if (offset < ids.length) {
      dispatch(
        fetchDocuments({
          accessToken: accessToken,
          ids: ids.slice(offset, offset + 10),
        })
      );
      setOffset((prevOffset) => prevOffset + 10);
    }
  };

  return (
    <div className="documents__wrapper">
      <h3 className="documents__title">Список документов</h3>

      {error ? (
        <p className="search-result__error search-result__error--info">
          Что-то пошло не так : <br />
          Попробуйте <Link to="/search">изменить параметры поиска</Link>
        </p>
      ) : (
        <>
          <div className="documents__content">
            {documents.map((el, index) => (
              <Document
                key={index}
                issueDate={el.ok.issueDate
                  .substring(0, 10)
                  .split("-")
                  .reverse()
                  .join(".")}
                source={el.ok.source.name}
                title={el.ok.title.text}
                isTechNews={el.ok.attributes.isTechNews}
                isAnnouncement={el.ok.attributes.isAnnouncement}
                isDigest={el.ok.attributes.isDigest}
                content={el.ok.content.markup}
                link={el.ok.url}
                wordCount={el.ok.attributes.wordCount}
              />
            ))}
          </div>
          {isLoading ? (
            <button disabled className="documents-button__loading">
              <Loader />
              <p>Загружаем данные</p>
            </button>
          ) : (
            offset < ids.length && (
              <button
                className="documents-button__active"
                onClick={loadMoreDocuments}
              >
                Показать больше
              </button>
            )
          )}
        </>
      )}
    </div>
  );
};

export default Documents;
