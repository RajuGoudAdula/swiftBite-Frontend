import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCartItems,
  updateQuantity,
  removeItem,
} from "../../store/slices/cartSlice";
import Lottie from 'lottie-react';
import animationData from '../../animations/cartIsEmpty.json';
import { addToast } from "../../store/slices/toastSlice";
import styles from "../../styles/Cart.module.css";
import Payment from "../user/Payment";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems = [], totalAmount = 0, loading, error } = useSelector(
    (state) => state.cart || {}
  );
  const { user } = useSelector((state) => state.auth || {});
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [dispatch, userId]);


  const handleIncrease = (itemId, quantity) => {
    dispatch(updateQuantity({ userId, itemId, quantity: quantity + 1 }));
  };

  const handleDecrease = (itemId, quantity) => {
    if (quantity > 1) {
      dispatch(updateQuantity({ userId, itemId, quantity: quantity - 1 }));
    }
  };

  const handleRemove = (itemId, itemName) => {
    dispatch(removeItem({ userId, itemId }))
      .unwrap()
      .then(() => {
        dispatch(addToast(
          {id: Date.now(),
          type: 'success',
          message: `${itemName} removed`,
          duration: 3000,}
        ));
      })
      .catch(() => {
        dispatch(addToast({
          id: Date.now(),
          type: 'error',
          message: `Failed to remove ${itemName}`,
          duration: 3000,
        }));
      });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Cart</h2>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : cartItems?.length === 0 ? (
        <>
        <p className={styles.empty}>Your cart is empty.</p>
        <div className={styles.animationWrapper}>
           <Lottie animationData={animationData} loop={true} style={{maxWidth:"500px" ,maxHeight:"500px" }}/>
         </div>
        </>
      ) : (
        <div className={styles.cartContainer}>
          {cartItems.map((item) => (
            <div key={item.productId._id} className={styles.item}>
              <img
                src={item.productId.image}
                alt={item.productId.name}
                className={styles.itemImage}
              />
              <div className={styles.itemDetails}>
                <div className={styles.itemName}>
                  <h4 className={styles.itemTitle}>{item.productId.name}</h4>
                   {item.itemId?.offers?.length > 0 && (
                    <span className={styles.discountText}>{item.itemId.offers[0]?.discount}% OFF</span>
                  )}
                
                <div className={styles.pricing}>
                  {item.itemId?.offers?.length > 0 ? (
                    <div>
                      <span className={styles.currentPrice}>₹{(item.itemId?.price)-(item.itemId?.price)*(item.itemId?.offers[0]?.discount)/100}</span>
                      <span className={styles.originalPrice}>₹{item.itemId?.price}</span>
                    </div>
                  ):(
                    <span className={styles.currentPrice}>₹{item.itemId?.price}</span>
                  )}
                </div>
                 
                </div>
                <div className={styles.quantityControls}>
                  <button
                    onClick={() =>
                      handleDecrease(item.productId._id, item.quantity)
                    }
                    className={styles.quantityButton}
                  >
                    <svg className={styles.quantityIcon} viewBox="0 0 24 24">
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleIncrease(item.productId._id, item.quantity)
                    }
                    className={styles.quantityButton}
                  >
                    <svg className={styles.quantityIcon} viewBox="0 0 24 24">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => handleRemove(item.productId._id, item.productId.name)}
                  className={styles.deleteButton}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <svg
                    className={styles.deleteIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cartItems?.length > 0 && (
        <div className={styles.totalContainer}>
          <h3 className={styles.total}>Total: ₹{totalAmount}</h3>
          <div>
            <Payment />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
