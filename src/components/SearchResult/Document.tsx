import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import defaultImg from "../../assets/images/default-img.png";
import "../../styles/Document.scss";

interface DocumentProps {
  issueDate: string;
  source: string;
  title: string;
  isTechNews: boolean;
  isAnnouncement: boolean;
  isDigest: boolean;
  content: string;
  link: string;
  wordCount: number;
}

const Document: React.FC<DocumentProps> = ({
  issueDate,
  source,
  title,
  isTechNews,
  isAnnouncement,
  isDigest,
  content,
  link,
  wordCount,
}) => {
  const [imgSrc, setImgSrc] = useState(defaultImg);

  useEffect(() => {
    // Получить ссылку на изображение из контента
    const imgUrlMatches = content.match(/https?:\/\/\S+"/g);
    const imgUrl = imgUrlMatches
      ? imgUrlMatches[0].replace('"', "")
      : defaultImg;
    setImgSrc(imgUrl);
  }, [content]);

  // Подчистить контент от HTML-тегов и спецсимволов
  const cleanContent = content
    .replace(/<.*?>/g, "")
    .replace(/&.*?;/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .replace(/<p>/g, "\n")
    .replace(/\/.*?\//g, "")
    .replace(/\(добавлен.*?\)/g, "")
    .trim();

  return (
    <div className="document">
      <div className="document__top">
        <div className="document__top--date-link">
          <p className="document__top--issue-date">{issueDate}</p>
          <Link className="document__top--issue-date" to={link} target="_blank">
            {source}
          </Link>
        </div>
        <p className="document__top--title">{title}</p>

        <div className="document__top--tag">
          {isTechNews && (
            <span className="document__top--tag document__top--technews">
              Технические новости
            </span>
          )}
          {isAnnouncement && (
            <span className="document__top--tag document__top--announcement">
              Анонсы и события
            </span>
          )}
          {isDigest && (
            <span className="document__top--tag document__top--digest">
              Сводки новостей
            </span>
          )}
        </div>
      </div>

      <div className="document__middle">
        <img
          src={imgSrc}
          alt="Document visual"
          className="document__middle--img"
        />
        <p className="document__middle--content">{cleanContent}</p>
      </div>

      <div className="document__bottom">
        <Link
          className="document__bottom--button-link"
          to={link}
          target="_blank"
        >
          Читать в источнике
        </Link>
        <span className="document__bottom--word-count">Слова: {wordCount}</span>
      </div>
    </div>
  );
};

export default Document;
