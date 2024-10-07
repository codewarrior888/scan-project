import React from "react";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import Loader from "../Loader/Loader";
import leftArrow from "../../assets/images/arrow-left.png";
import rightArrow from "../../assets/images/arrow-right.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/SummarySlider.scss";

interface ArrowProps {
  onClick?: () => void;
}

const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <div className="slick-prev" onClick={onClick}>
    <img src={leftArrow} alt="Previous" />
  </div>
);

const NextArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <div className="slick-next" onClick={onClick}>
    <img src={rightArrow} alt="Next" />
  </div>
);

let settings = {
  dots: false,
  infinite: false,
  arrows: true,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
  slidesToShow: 8,
  slidesToScroll: 3,
  // centerMode: true,
  // variableWidth: true,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 1000,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 940,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 550,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const SimpleSlider: React.FC = () => {
  const { data, isLoading } = useSelector(
    (state: RootState) => state.histogram
  );

  const dataMap =
    data && data.length > 0
      ? data[0].data.map((item, index) => ({
          date: item.date
            .substring(0, 10)
            .split("-")
            .join(".")
            .split(".")
            .reverse()
            .join("."),
          total: data[0].data[index]?.value || 0,
          risks: data[1]?.data[index]?.value || 0,
        }))
      : [];

  const totalSummary = dataMap.reduce(
    (acc, item) => acc + item.total + item.risks,
    0
  );

  if (isLoading) {
    return (
      <div className="slider-loader">
        <Loader />
        <p className="loading-data">Загружаем данные</p>
      </div>
    );
  }

  if (data.length === 0) {
    return <p>No data available.</p>;
  }

  return (
    <div>
      <h3 className="summary-title">Общая сводка</h3>
      <p className="summary-all">Найдено {totalSummary} вариантов</p>
      <div className="slider-wrapper">
        <div className="slider-titles">
          <p>Период</p>
          <p>Всего</p>
          <p>Риски</p>
        </div>
        <Slider className="summary-slider" {...settings}>
          {dataMap.map((item, index) => (
            <div className="slider-item" key={index}>
              <p>{item.date}</p>
              <p>{item.total}</p>
              <p>{item.risks}</p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SimpleSlider;
