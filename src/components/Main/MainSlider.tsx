import React, { useState, useEffect, useCallback } from "react";
import time from "../../assets/images/time.png";
import search from "../../assets/images/search.png";
import safety from "../../assets/images/safety.png";
import leftArrow from "../../assets/images/arrow-left.png";
import rightArrow from "../../assets/images/arrow-right.png";
import "../../styles/MainSlider.scss";

const MainSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(3);

  const slider = [
    {
      text: "Высокая и оперативная скорость обработки заявки",
      icon: time,
    },

    {
      text: "Огромная комплексная база данных, обеспечивающая объективный ответ на запрос",
      icon: search,
    },

    {
      text: "Защита конфеденциальных сведений, не подлежащих разглашению по федеральному законодательству",
      icon: safety,
    },

    {
      text: "Высокая и оперативная скорость обработки заявки",
      icon: time,
    },

    {
      text: "Огромная комплексная база данных, обеспечивающая объективный ответ на запрос",
      icon: search,
    },

    {
      text: "Защита конфеденциальных сведений, не подлежащих разглашению по федеральному законодательству",
      icon: safety,
    },
  ];

  const BREAKPOINT_DESKTOP = 1200;
  const BREAKPOINT_TABLET = 768;

  // Обновление видимых слайдов
  const updateVisibleSlides = useCallback(() => {
    if (window.innerWidth >= BREAKPOINT_DESKTOP) {
      setVisibleSlides(3);
    } else if (window.innerWidth >= BREAKPOINT_TABLET) {
      setVisibleSlides(2);
    } else {
      setVisibleSlides(1);
    }
  }, []);

  useEffect(() => {
    updateVisibleSlides();
    window.addEventListener("resize", updateVisibleSlides);
    return () => window.removeEventListener("resize", updateVisibleSlides);
  }, []);

  const nextSlide = () => {
    if (currentIndex < slider.length - visibleSlides) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="main-slider">
      {currentIndex > 0 && (
        <button className="slider-btn prev-btn" onClick={prevSlide}>
          <img src={leftArrow} alt="Previous" className="prev-arrow" />
        </button>
      )}

      <div className="slider-content">
        <div
          className="slider-wrapper"
          style={{
            transform: `translateX(-${(100 / visibleSlides) * currentIndex}%)`,
            gridTemplateColumns: `repeat(${slider.length}, ${
              100 / visibleSlides
            }%)`,
          }}
        >
          {slider.map((card, index) => (
            <div key={index} className="slider-card">
              <img
                src={card.icon}
                alt={`Icon ${index}`}
                className="slider-card-icon"
              />
              <p className="slider-card-text">{card.text}</p>
            </div>
          ))}
        </div>
      </div>

      {currentIndex < slider.length - visibleSlides && (
        <button className="slider-btn next-btn" onClick={nextSlide}>
          <img src={rightArrow} alt="Next" className="next-arrow" />
        </button>
      )}
    </div>
  );
};

export default MainSlider;
