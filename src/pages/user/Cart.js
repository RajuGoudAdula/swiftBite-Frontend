import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartItems } from "../../store/slices/cartSlice";
import Lottie from "lottie-react";
import animationData from "../../animations/cartIsEmpty.json";
import styles from "../../styles/Cart.module.css";
import Payment from "../user/Payment";
import SwiftBiteLoader from "../../components/common/SwiftBiteLoader";
import CartItem from "./CartItem";
import { AnimatePresence } from "framer-motion";

const Cart = () => {
  const dispatch = useDispatch();
  const [localCartItems, setLocalCartItems] = useState([]);

  const { cartItems = [], totalAmount = 0, loading, error } = useSelector(
    (state) => state.cart || {}
  );
  const { user } = useSelector((state) => state.auth || {});
  const userId = user?.id;

  // Fetch cart items
  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [dispatch, userId]);

  // Sync redux cartItems to localCartItems
  useEffect(() => {
    setLocalCartItems(cartItems);
  }, [cartItems]);

  // Remove item from local state after exit animation
  const handleRemoveComplete = useCallback(
    (itemIdToRemove) => {
      setLocalCartItems((prev) =>
        prev.filter((item) => item._id !== itemIdToRemove)
      );
    },
    []
  );

  // Render cart items with AnimatePresence
  const renderedItems = useMemo(
    () => (
      <AnimatePresence mode="popLayout">
        {localCartItems.map((item, index) => {
          const key =
            (item.productId && item.productId._id) || item._id || index;
          return (
            <CartItem
              key={key}
              item={item}
              userId={userId}
              onRemoveComplete={handleRemoveComplete}
            />
          );
        })}
      </AnimatePresence>
    ),
    [localCartItems, userId, handleRemoveComplete]
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Cart</h2>

      {loading ? (
        <SwiftBiteLoader info="Loading Your Cart..." />
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : localCartItems.length === 0 ? (
        <>
          <p className={styles.empty}>Your cart is empty.</p>
          <div className={styles.animationWrapper}>
            <Lottie
              animationData={animationData}
              loop
              style={{ maxWidth: "500px", maxHeight: "500px" }}
            />
          </div>
        </>
      ) : (
        <div className={styles.cartContainer}>{renderedItems}</div>
      )}

      {localCartItems.length > 0 && (
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
