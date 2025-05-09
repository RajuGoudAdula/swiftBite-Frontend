import React, { useEffect, useState, useRef } from 'react';
import styles from '../../styles/HeroSection.module.css';

const slides = [
  {
    title: "Order Smarter with SwiftBite",
    subtitle: "Skip the lines. Pick up your favorite food on time, every time.",
    image: require('../../assets/hero-image.webp'),
    buttonText: "Get Started",
    buttonAction: () => alert("Redirecting to onboarding..."),
    delay: 5000,
  },
  {
    title: "Canteen Closed on Sunday",
    subtitle: "Plan your meals ahead. We’re closed every Sunday!",
    image: require('../../assets/canteen-closed.webp'),
    buttonText: "View Schedule",
    buttonAction: () => alert("Opening canteen schedule..."),
    delay: 3000,
  },
  {
    title: "Flat 20% Off This Week",
    subtitle: "Enjoy tasty meals at discounted prices all week long.",
    image: require('../../assets/canteen-closed.webp'),
    buttonText: "Grab Offer",
    buttonAction: () => alert("Taking you to offers..."),
    delay: 7000,
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef(null);

  const setSlideWithDelay = (index) => {
    clearTimeout(timerRef.current);
    setCurrentSlide(index);
    timerRef.current = setTimeout(() => {
      setCurrentSlide((index + 1) % slides.length);
    }, slides[index].delay);
  };

  useEffect(() => {
    setSlideWithDelay(0); // Start with the first slide
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setCurrentSlide((prevIndex) => (prevIndex + 1) % slides.length);
    }, slides[currentSlide].delay);
    return () => clearTimeout(timerRef.current);
  }, [currentSlide]);

  const { title, subtitle, image, buttonText, buttonAction } = slides[currentSlide];

  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <button className={styles.cta} onClick={buttonAction}>
          {buttonText}
        </button>
      </div>
      <div className={styles.dots}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => setSlideWithDelay(index)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
