import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FavouriteButton from '../../pages/user/FavouriteButton';
import styles from '../../styles/MenuItem.module.css';

const MenuItem = ({ item, onAddToCart }) => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth || {});
  const [isAdded, setIsAdded] = useState(false);

  const discountedPrice = item.offers.length > 0 
    ? Math.round(item.price - (item.offers[0].discount * item.price) / 100)
    : item.price;

  const handleAddToCart = () => {
    onAddToCart(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1300);
  };

  const OfferBadge = () => (
    item.offers.length > 0 && (
      <div className={styles.desktopOfferBadge}>
        <span className={styles.offerText}>
          {item.offers[0].offerType} 
        </span>
      </div>
    )
  );

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
        {item.stock < 10 && item.stock !== 0 && (
          <div className={styles.stockDiv}>
            <span className={styles.lowStock}>Only {item.stock} left</span>
          </div>
        )}
      </div>

      <div className={styles.desktopBottomSection}>
        <div className={styles.desktopDetails} onClick={() => navigate(`/item/${item._id}`)}>
          <h3 className={styles.productName}>{item.name}</h3>
          <span className={styles.unitWeight}>
            1 {item.productId.unit} • {item.productId.netWeight}
          </span>

          <div className={styles.pricing}>
            <span className={styles.currentPrice}>₹{discountedPrice}</span>
            {item.offers.length > 0 && (
              <span className={styles.originalPrice}>₹{item.price}</span>
            )}
          </div>
        </div>

        {item.isAvailable && item.stock !== 0 ? (
          <div className={styles.desktopActionSection}>
            <div className={styles.favouriteButton}>
              <FavouriteButton
                userId={user.id}
                canteenId={user.canteen._id}
                itemId={item._id}
              />
            </div>
            <div className={styles.onAddToCartButton}>
              <button 
                className={`${styles.desktopAddButton} ${isAdded ? styles.added : ''}`}
                onClick={handleAddToCart}
                disabled={isAdded}
              >
                {isAdded  ? (
                  <span className={styles.animatedAdded}>
                    Added 
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="white" 
                      width="18px" 
                      height="18px" 
                      className={styles.checkIcon}
                    >
                      <path d="M20.285 6.709a1 1 0 0 0-1.414-1.418L9 15.164l-3.871-3.87a1 1 0 1 0-1.414 1.414l4.578 4.578a1 1 0 0 0 1.414 0l10.578-10.577z"/>
                    </svg>


                    <div className={styles['sparkle-container']}>
                      {[...Array(20)].map((_, i) => {
                        const angle = (360 / 20) * i;
                        const radius = 20;
                        const x = radius * Math.cos((angle * Math.PI) / 180);
                        const y = radius * Math.sin((angle * Math.PI) / 180);
                        const colors = [
                          '#FFD700', '#FF69B4', '#00FFFF', '#ADFF2F', '#FF4500', '#00FF7F',
                          '#FF1493', '#87CEEB', '#FFA500', '#7CFC00', '#DC143C', '#1E90FF',
                          '#DA70D6', '#20B2AA', '#FFB6C1', '#32CD32', '#FF00FF', '#00CED1',
                          '#FFFF00', '#8A2BE2'
                        ];

                        const delay = Math.random() * 0.3;         
                        const duration = 0.8 + Math.random() * 0.4;

                        return (
                          <div
                            key={i}
                            className={styles.sparkle}
                            style={{
                              backgroundColor: colors[i % colors.length],
                              '--x': `${x}px`,
                              '--y': `${y}px`,
                              animationDelay: `${delay}s`,
                              animationDuration: `${duration}s`,
                            }}
                          />
                        );
                      })}
                    </div>

                  </span>
                ) : 'Add to Bag'}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.outOfStockDiv}>
            <span className={styles.outOfStock}>Out of stock</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItem;
