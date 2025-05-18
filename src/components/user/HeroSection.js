import React, { useEffect, useState, useRef } from 'react';
import styles from '../../styles/HeroSection.module.css';
import userApi from '../../api/userApi';
import { useSelector } from 'react-redux';

const HeroSection = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef(null);
  const { user } = useSelector((state) => state.auth || {});

  const isBannerActive = (banner) => {
    const now = new Date();
    const start = new Date(banner.schedule.startDate);
    const end = new Date(banner.schedule.endDate);
    return banner.isActive && now >= start && now <= end;
  };

  const setSlideWithDelay = (index, delay) => {
    clearTimeout(timerRef.current);
    setCurrentSlide(index);
    timerRef.current = setTimeout(() => {
      setCurrentSlide((index + 1) % slides.length);
    }, delay || 5000);
  };

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await userApi.getHeroBanners(user?.id, user?.college?._id);
        const banners = response.data.filter(isBannerActive);
        setSlides(banners);
        if (banners.length > 0) {
          setSlideWithDelay(0, 5000);
        }
      } catch (error) {
        console.error("Failed to fetch hero banners:", error);
      }
    };

    fetchSlides();
    return () => clearTimeout(timerRef.current);
  }, [user?.id, user?.college?._id]);

  useEffect(() => {
    if (slides.length > 0) {
      timerRef.current = setTimeout(() => {
        setCurrentSlide((prevIndex) => (prevIndex + 1) % slides.length);
      }, 5000);
      return () => clearTimeout(timerRef.current);
    }
  }, [currentSlide, slides]);

  if (slides.length === 0) return null;

  const current = slides[currentSlide] || {}; // <-- add fallback to empty object
  const { title, subtitle, media, cta } = current;

  const handleCTA = () => {
    if (cta?.link) {
      if (cta.type === 'external') {
        window.open(cta.link, '_blank');
      } else {
        window.location.href = cta.link; // For internal navigation (consider React Router if needed)
      }
    }
  };

  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${media?.imageUrl || ''})` }} // fallback empty string to avoid invalid url
    >
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>{title || 'Welcome'}</h1>
        <p className={styles.subtitle}>{subtitle || ''}</p>
        {cta?.text && (
          <button className={styles.cta} onClick={handleCTA}>
            {cta.text}
          </button>
        )}
      </div>
      <div className={styles.dots}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => setSlideWithDelay(index, 5000)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
