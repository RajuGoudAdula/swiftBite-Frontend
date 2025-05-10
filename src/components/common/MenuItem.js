import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/MenuItem.module.css';
import FavouriteButton from '../../pages/user/FavouriteButton';
import { useSelector } from 'react-redux';

const MenuItem = ({ item, onAddToCart ,isFavourites}) => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth || {});
  
  const discountedPrice = item.offers.length > 0 
    ? Math.round(item.price - (item.offers[0].discount * item.price) / 100)
    : item.price;

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
        {item.stock < 10 && (
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
        
          {item.isAvailable ? (
          
              <div className={styles.desktopActionSection}>
                <div className={styles.favouriteButton}>
                    <FavouriteButton userId={user.id} canteenId={user.canteen._id} itemId={item._id}/>
                </div>
                <div className={styles.onAddToCartButton}>
                    <button 
                      className={styles.desktopAddButton}
                      onClick={() => onAddToCart(item)}
                    >
                      Add to Bag
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