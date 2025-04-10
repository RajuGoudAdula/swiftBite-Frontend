import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/MenuItem.module.css';

const MenuItem = ({ item, isAdmin, onAddToCart }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  
  const CustomPlus = () => (
    <svg
      width="45"
      height="45"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF4500"
      strokeWidth="2"  
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const discountedPrice = item.offers.length > 0 
    ? Math.round(item.price - (item.offers[0].discount * item.price) / 100)
    : item.price;

  const OfferBadge = () => (
    item.offers.length > 0 && (
      <div className={isMobile ? styles.mobileOfferBadge : styles.desktopOfferBadge}>
        <span className={styles.offerText}>
          {item.offers[0].offerType} 
        </span>
      </div>
    )
  );

  const renderTags = () => {
    if (!item.productId.tags || item.productId.tags.length === 0) return null;
    
    return (
      <div className={styles.tagsContainer}>
        {item.productId.tags.map((tag, index) => (
          <span key={index} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
    );
  };

  if (isMobile) {
    return (
      <div className={styles.mobileContainer}>
        <div className={styles.mobileTopSection}>
          <div className={styles.mobileDetails} onClick={() => navigate(`/item/${item._id}`)}>
            <h3 className={styles.productName}>{item.name}</h3>
            <span className={styles.unitWeight}>
             1 {item.productId.unit} • {item.productId.netWeight}
            </span>
            {item.offers.length > 0 && (
                <span className={styles.discountText}>{item.offers[0].discount}% OFF</span>
              )}
           
            <div className={styles.pricing}>
              <span className={styles.currentPrice}>₹{discountedPrice}</span>
              {item.offers.length > 0 && (
                <span className={styles.originalPrice}>₹{item.price}</span>
              )}
            </div>
          </div>
          
          <div className={styles.mobileActionSection}>
            {item.isAvailable ? (
              <>
                <button 
                  className={styles.mobileAddButton}
                  onClick={() => onAddToCart(item)}
                >
                  <CustomPlus className={styles.plusIcon} />
                </button>
                {item.stock < 10 && (
                  <span className={styles.lowStock}>Only {item.stock} left</span>
                )}
              </>
            ) : (
              <span className={styles.outOfStock}>Out of stock</span>
            )}
          </div>
        </div>
        
        <div className={styles.mobileImageWrapper} onClick={() => navigate(`/item/${item._id}`)}>
          <img
            src={item.productId.image}
            alt={item.name}
            className={styles.mobileProductImage}
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className={styles.desktopContainer}>
      <div className={styles.desktopImageWrapper} onClick={() => navigate(`/item/${item._id}`)}>
        <img
          src={item.productId.image}
          alt={item.name}
          className={styles.desktopProductImage}
          loading="lazy"
        />
        <OfferBadge />
      </div>
      
      <div className={styles.desktopBottomSection}>
        <div className={styles.desktopDetails} onClick={() => navigate(`/item/${item._id}`)}>
          <h3 className={styles.productName}>{item.name}</h3>
          <span className={styles.unitWeight}>
            1 {item.productId.unit} • {item.productId.netWeight}
          </span>
          {item.offers.length > 0 && (
              <span className={styles.discountText}>{item.offers[0].discount}% OFF</span>
            )}
          <div className={styles.pricing}>
            <span className={styles.currentPrice}>₹{discountedPrice}</span>
            {item.offers.length > 0 && (
              <span className={styles.originalPrice}>₹{item.price}</span>
            )}
            
          </div>
        </div>
        
        <div className={styles.desktopActionSection}>
          {item.isAvailable ? (
            <>
              <button 
                className={styles.desktopAddButton}
                onClick={() => onAddToCart(item)}
              >
                ADD
              </button>
              {item.stock < 10 && (
                <span className={styles.lowStock}>Only {item.stock} left</span>
              )}
            </>
          ) : (
            <span className={styles.outOfStock}>Out of stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;