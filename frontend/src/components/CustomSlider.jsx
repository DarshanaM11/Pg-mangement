import React, { useState, useEffect } from "react";
import "./CustomSlider.css";

const CustomSlider = ({ children }) => {
  const [current, setCurrent] = useState(0);
  const length = React.Children.count(children);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 3000); // Autoplay every 3 seconds
    return () => clearInterval(interval);
  }, [length]);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % length);
  };

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + length) % length);
  };

  return (
    <div className="slider-container">
      <div className="slider-wrapper">
        {React.Children.map(children, (child, index) => (
          <div className={`slide ${index === current ? "active" : ""}`}>
            {index === current && child}
          </div>
        ))}
        <button className="prev" onClick={goPrev}>‹</button>
        <button className="next" onClick={goNext}>›</button>
      </div>
      <div className="dots">
        {Array.from({ length }).map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default CustomSlider;
