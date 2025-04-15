import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import styles from '../../styles/FavouriteButton.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { addFavouriteItem, removeFavouriteItem } from '../../store/slices/favouriteItemsSlice';

const FavouriteButton = ({ userId, canteenId, itemId }) => {
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favouriteItems.items);    
  const [isFavourite, setIsFavourite] = useState(false);

  // Sync with Redux favourites
  useEffect(() => {
    const isFav = favourites.find((fav) => fav.itemId === itemId);
    setIsFavourite(!!isFav); // Convert to boolean
  }, [favourites, itemId]);

  const toggleFavourite = async () => {
    try {
      if (isFavourite) {
       await dispatch(removeFavouriteItem({ userId, canteenId, itemId }));
      } else {
       await dispatch(addFavouriteItem({ userId, canteenId, itemId }));  
      }
      setIsFavourite(!isFavourite); // Optimistic UI update
    } catch (err) {
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
      {isFavourite ? (
        <FaHeart style={{ color: 'orangered' }} />
      ) : (
        <FaRegHeart />
      )}
    </button>
  );
};

export default FavouriteButton;
