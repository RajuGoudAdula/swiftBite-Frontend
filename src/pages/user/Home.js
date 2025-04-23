import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMenuOfCanteen } from '../../store/slices/menuSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { fetchColleges, fetchCanteens } from '../../store/slices/collegeSlice';
import { addCollegeCanteen } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/toastSlice';

import Dropdown from '../../components/common/Dropdown';
import ModalPopup from '../../components/common/ModalPopup';
import MenuItem from '../../components/common/MenuItem';
import LoadingErrorHandler from '../../components/common/LoadingErrorHandler';
import styles from "../../styles/Home.module.css";
import { fetchFavouriteItems } from '../../store/slices/favouriteItemsSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading, error } = useSelector(state => state.menu || {});
  const { user, isAuthenticated } = useSelector(state => state.auth || {});
  const { colleges = [], canteens = [] } = useSelector(state => state.college || {});
  const favourites = useSelector((state) => state.favouriteItems.items || {});    
  let favouriteItemsList;
  if(favourites.length > 0){
    const favouriteItemIds = favourites.map((fav) => fav.itemId);
    favouriteItemsList = items.filter((item) => favouriteItemIds.includes(item._id));
  }

  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedCanteen, setSelectedCanteen] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user?.college || !user?.canteen) {
      setModalOpen(true);
    } else {
      dispatch(fetchMenuOfCanteen(user.canteen._id));
      dispatch(fetchFavouriteItems({userId : user.id,canteenId : user.canteen._id}))
    }
  }, [user, dispatch ,user?.college , user?.canteen]);




  useEffect(() => {
    dispatch(fetchColleges());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCollege) {
      dispatch(fetchCanteens(selectedCollege));
    }
  }, [selectedCollege, dispatch]);

  const handleAddToCart = (item) => {
    if (!isAuthenticated) {
      dispatch(addToast({
        id: Date.now(),
        type: 'warning',
        message: 'Please login to add items to your cart',
        duration: 3000,
      }));
      navigate('/login');
      return;
    }

    dispatch(addToCart({
      userId: user?.id,
      data: {
        itemId: item._id,
        quantity: 1,
      }
    }));

    dispatch(addToast({
      id: Date.now(),
      type: 'success',
      message: `${item.name} added to cart`,
      duration: 3000,
    }));
  };

  const handleConfirmSelection = () => {
    if (!selectedCollege || !selectedCanteen) {
      dispatch(addToast({
        id: Date.now(),
        type: 'error',
        message: 'Please select a college and a canteen.',
        duration: 3000,
      }));
      return;
    }

    dispatch(addCollegeCanteen({
      userId: user.id,
      collegeId: selectedCollege,
      canteenId: selectedCanteen
    }));

    dispatch(addToast({
      id: Date.now(),
      type: 'success',
      message: 'Canteen and college updated',
      duration: 3000,
    }));

    setModalOpen(false);
  };

  const modalButtons=[
    {
      label : "Confirm",
      onClick : handleConfirmSelection,
      variant: 'primary',
      disabled: !(selectedCollege && selectedCanteen),
    }
  ]

  return (
    <div className={styles["home"]}>
      
      <ModalPopup isOpen={modalOpen} title="Select Your College and Canteen" buttons={modalButtons} >
        <Dropdown label="College" options={colleges} value={selectedCollege} onChange={e => setSelectedCollege(e.target.value)} />
        {selectedCollege && (
          <Dropdown label="Canteen" options={canteens} value={selectedCanteen} onChange={e => setSelectedCanteen(e.target.value)} />
        )}
      </ModalPopup>
      {favouriteItemsList?.length > 0 && (
      <>
        <h5 className={styles.title}>Your Favourite Items</h5>
        <LoadingErrorHandler loading={loading} error={error} data={items}>
          <div className={styles["favourites-container"]}>
            {favouriteItemsList?.map(item => (
              <MenuItem 
                key={item._id} 
                item={item} 
                onClick={() => navigate(`/item/${item._id}`)} 
                onAddToCart={() => handleAddToCart(item)}
                isFavourites={true}
              />
            ))}
          </div>
        </LoadingErrorHandler>
      </>
      )}
      <h2 className={styles.title}>Canteen Menu</h2>
      <LoadingErrorHandler loading={loading} error={error} data={items}>
        <div className={styles["menu-container"]}>
          {items.map(item => (
            <MenuItem 
              key={item._id} 
              item={item} 
              onClick={() => navigate(`/item/${item._id}`)} 
              onAddToCart={() => handleAddToCart(item)}
              isFavourites={false}
            />
          ))}
        </div>
      </LoadingErrorHandler>
    </div>
  );
};

export default Home;
