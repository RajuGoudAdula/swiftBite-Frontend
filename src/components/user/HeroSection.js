import React, { useEffect, useState, useRef } from 'react';
import styles from '../../styles/HeroSection.module.css';
import userApi from '../../api/userApi';
import { useSelector } from 'react-redux';

const HeroSection = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);
  const { user } = useSelector((state) => state.auth || {});

  const isBannerActive = (banner) => {
    const now = new Date();
    const start = new Date(banner.schedule.startDate);
    const end = new Date(banner.schedule.endDate);
    return banner.isActive && now >= start && now <= end;
  };

  const setSlideWithDelay = (index, delay = 5000) => {
    clearTimeout(timerRef.current);
    setCurrentSlide(index);
    timerRef.current = setTimeout(() => {
      setCurrentSlide((index + 1) % slides.length);
    }, delay);
  };

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await userApi.getHeroBanners(user?.id, user?.college?._id);
        const banners = response.data;
        setSlides(banners);
        if (banners.length > 0) {
          setSlideWithDelay(0);
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
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearTimeout(timerRef.current);
  }, [currentSlide, slides]);

  const handleCTA = () => {
    const link = slides[currentSlide]?.cta?.link;
    const type = slides[currentSlide]?.cta?.type;
    if (link) {
      if (type === 'external') {
        window.open(link, '_blank');
      } else {
        window.location.href = link;
      }
    }
  };

  // Swipe handlers
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const startX = touchStartXRef.current;
    const endX = touchEndXRef.current;
    if (startX != null && endX != null) {
      const deltaX = startX - endX;
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // swipe left
          setSlideWithDelay((currentSlide + 1) % slides.length);
        } else {
          // swipe right
          setSlideWithDelay((currentSlide - 1 + slides.length) % slides.length);
        }
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  if (slides.length === 0) return null;

  const current = slides[currentSlide] || {};
  const { title, subtitle, media, cta } = current;

  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${media?.imageUrl || ''})` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.overlay}></div>
      <div className={`${styles.content} ${styles.fadeUp}`}>
        <h1 className={styles.title}>{title || 'Welcome to SwiftBite'}</h1>
        <p className={styles.subtitle}>{subtitle || 'Place Order.Enjoy with your canteen food.'}</p>
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
            onClick={() => setSlideWithDelay(index)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
