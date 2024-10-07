import React, { useState } from "react";
import axios from "axios";
import "../styles/Test.scss";
import { API_URL } from "../components/api";

localStorage.getItem("accessToken");

// Пример статического запроса
const formData = {
  dateFrom: "2014-01-01",
  dateTo: "2024-03-30",
  companyInn: "7736050003",
  tonality: "any",
  limit: 100,
  attributes: {
    maxFullness: false,
    inBusinessNews: false,
    onlyMainRole: false,
    onlyWithRiskFactors: false,
    isTechNews: false,
    isAnnouncement: false,
    isDigest: false,
  },
};

// Запрос для получения сводки по количеству публикаций на конкретные даты.
export const fetchHistogramData = async (formData) => {
  const requestBody = {
    intervalType: "month",
    histogramTypes: ["totalDocuments", "riskFactors"],
    issueDateInterval: {
      startDate: formData.dateFrom,
      endDate: formData.dateTo,
    },
    searchContext: {
      targetSearchEntitiesContext: {
        targetSearchEntities: [
          {
            type: "company",
            sparkId: null,
            entityId: null,
            inn: formData.companyInn,
            maxFullness: formData.attributes.maxFullness,
            inBusinessNews: formData.attributes.inBusinessNews,
          },
        ],
        onlyMainRole: formData.attributes.onlyMainRole,
        tonality:
          formData.tonality === "Любая"
            ? "any"
            : formData.tonality === "Позитивная"
            ? "positive"
            : "negative",
        onlyWithRiskFactors: formData.attributes.onlyWithRiskFactors,
        riskFactors: {
          and: [],
          or: [],
          not: [],
        },
        themes: {
          and: [],
          or: [],
          not: [],
        },
      },
      themesFilter: {
        and: [],
        or: [],
        not: [],
      },
    },
    similarMode: "none",
    limit: Math.min(Math.max(formData.limit, 1), 1000),
    sortType: "issueDate",
    sortDirectionType: "asc",
    // attributeFilters: {
    //   excludeTechNews: formData.attributes.isTechNews,
    //   excludeAnnouncements: formData.attributes.isAnnouncement,
    //   excludeDigests: formData.attributes.isDigest,
    // },
  };

  console.log(requestBody);

  try {
    const accessToken = localStorage.getItem("accessToken");

    const response = await axios.post(
      `${API_URL}/objectsearch/histograms`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Ошибка :", error);
    throw error;
  }
};

// Поиск публикаций по запросу. Возвращает только список *ID* публикаций.
export const fetchPublications = async (formData) => {
  const requestBody = {
    intervalType: "month",
    histogramTypes: ["totalDocuments", "riskFactors"],
    issueDateInterval: {
      startDate: formData.dateFrom,
      endDate: formData.dateTo,
    },
    searchContext: {
      targetSearchEntitiesContext: {
        targetSearchEntities: [
          {
            type: "company",
            sparkId: null,
            entityId: null,
            inn: formData.companyInn,
            maxFullness: formData.attributes.maxFullness,
            inBusinessNews: formData.attributes.inBusinessNews,
          },
        ],
        onlyMainRole: formData.attributes.onlyMainRole,
        tonality:
          formData.tonality === "Любая"
            ? "any"
            : formData.tonality === "Позитивная"
            ? "positive"
            : "negative",
        onlyWithRiskFactors: formData.attributes.onlyWithRiskFactors,
        riskFactors: {
          and: [],
          or: [],
          not: [],
        },
        themes: {
          and: [],
          or: [],
          not: [],
        },
      },
      themesFilter: {
        and: [],
        or: [],
        not: [],
      },
    },
    similarMode: "none",
    limit: Math.min(Math.max(formData.limit, 1), 1000),
    sortType: "issueDate",
    sortDirectionType: "asc",
    // attributeFilters: {
    //   excludeTechNews: formData.attributes.isTechNews,
    //   excludeAnnouncements: formData.attributes.isAnnouncement,
    //   excludeDigests: formData.attributes.isDigest,
    // },
  };

  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.post(`${API_URL}/objectsearch`, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка получения публикации:", error);
    throw error;
  }
};

// Запрос для получения текстов и параметров публикаций по их *ID*.
export const fetchPublicationDetails = async (ids) => {
  const requestBody = {
    ids: ids.slice(0, 100),
  };

  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.post(`${API_URL}/documents`, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching publication details:", error);
    throw error;
  }
};

// Запрос для получения текстов и параметров публикаций по их *ID*.
const Test: React.FC = () => {
  const [histogramData, setHistogramData] = useState(null);
  const [publications, setPublications] = useState(null);
  const [publicationDetails, setPublicationDetails] = useState(null);

  const [isLoadingHistogram, setIsLoadingHistogram] = useState(false);
  const [isLoadingPublications, setIsLoadingPublications] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const handleFetchHistogramData = async () => {
    setIsLoadingHistogram(true);
    try {
      const data = await fetchHistogramData(formData);
      setHistogramData(data);
      console.log("Общая сводка:", data);
    } catch (error) {
      console.error("Ошибка получения общей сводки:", error);
    } finally {
      setIsLoadingHistogram(false);
    }
  };

  const handleFetchPublications = async () => {
    setIsLoadingPublications(true);
    try {
      const data = await fetchPublications(formData);
      setPublications(data);
      console.log("Найденные публикации:", data);
    } catch (error) {
      console.error("Ошибка получения публикации:", error);
    } finally {
      setIsLoadingPublications(false);
    }
  };

  const handleFetchPublicationDetails = async () => {
    if (!publications || !publications.items) {
      console.error("Недостаточно данных для получения деталей публикации");
      return;
    }

    setIsLoadingDetails(true);
    const publicationIds = publications.items.map((item) => item.encodedId);

    try {
      const details = await fetchPublicationDetails(publicationIds);
      setPublicationDetails(details);
      console.log("Детали публикации:", details);
    } catch (error) {
      console.error("Ошибка получения деталей публикации:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleReset = () => {
    setHistogramData(null);
    setPublications(null);
    setPublicationDetails(null);
  };

  return (
    <div className="test">
      <div className="top-section">
        <h1>API Test Component</h1>
        <button
          className="button"
          onClick={handleFetchHistogramData}
          disabled={isLoadingHistogram}
        >
          {isLoadingHistogram ? "Загружаем..." : "Получить общую сводку"}
        </button>
        <button
          className="button"
          onClick={handleFetchPublications}
          disabled={isLoadingPublications}
        >
          {isLoadingPublications ? "Загружаем..." : "Получить публикации с ID"}
        </button>
        <button
          className="button"
          onClick={handleFetchPublicationDetails}
          disabled={isLoadingDetails}
        >
          {isLoadingDetails ? "Загружаем..." : "Получить детали публикаций"}
        </button>
      </div>
      <div className="reset">
        <button className="reset__reset-button" onClick={handleReset}>
          Сбросить данные
        </button>
      </div>

      <div className="results-section">
        <h2>Results</h2>

        <div className="section histogram-section">
          <h3>Histogram Data</h3>
          <pre>{JSON.stringify(histogramData, null, 2)}</pre>
        </div>

        <div className="section publications-section">
          <h3>Publications</h3>
          <pre>{JSON.stringify(publications, null, 2)}</pre>
        </div>

        <div className="section publication-details-section">
          <h3>Publication Details</h3>
          <pre>{JSON.stringify(publicationDetails, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default Test;
