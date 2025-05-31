import { useState, useEffect } from 'react';
import styles from '../../styles/FavouriteButton.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { addFavouriteItem, removeFavouriteItem } from '../../store/slices/favouriteItemsSlice';

const FavouriteButton = ({ userId, canteenId, itemId }) => {
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favouriteItems.items);
  const [isFavourite, setIsFavourite] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    const isFav = favourites.find((fav) => fav.itemId === itemId);
    setIsFavourite(!!isFav);
  }, [favourites, itemId]);

  const toggleFavourite = async () => {
    try {
      setIsFavourite(!isFavourite);
      if (isFavourite) {
        await dispatch(removeFavouriteItem({ userId, canteenId, itemId }));
      } else {
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 1300);
        await dispatch(addFavouriteItem({ userId, canteenId, itemId }));
      }
    } catch (err) {
      setIsFavourite(!isFavourite);
      console.error('Error updating favourite:', err);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavourite();
      }}
      className={styles.favouriteButton}
    >
      <svg
        viewBox="0 0 24 24"
        className={`${styles.heart} ${isFavourite ? styles.liked : ''}`}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09
                C13.09 3.81 14.76 3 16.5 3
                19.58 3 22 5.42 22 8.5
                c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>

      {showSparkles && (
                  <div className={styles['sparkle-container']}>
                  {[...Array(20)].map((_, i) => {
                    // Random angle in radians for direction
                    const angle = Math.random() * 2 * Math.PI;
                
                    // Random radius (distance) between 10px and 30px
                    const radius = 10 + Math.random() * 20;
                
                    // Calculate x and y offsets based on random angle and radius
                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);
                
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
                
    )}



    </button>
  );
};

export default FavouriteButton;
