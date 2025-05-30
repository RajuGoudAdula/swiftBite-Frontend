import React, { useEffect, useState, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchCartItems, removeItem } from "../../store/slices/cartSlice";
import styles from "../../styles/FloatingButton.module.css";

function FloatingCartButton() {
  const { totalAmount, cartItems = [] } = useSelector((state) => state.cart || {});
  const { user } = useSelector((state) => state.auth || {});
  const [previousAmount, setPreviousAmount] = useState(0);
  const userId = user?.id || null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const timerRefs = useRef([]);

  // Queue system for item removal
  const [removalQueue, setRemovalQueue] = useState([]);

  const formattedTotal = useMemo(() => {
    const displayAmount =
      typeof totalAmount === "number" && totalAmount > 0 ? totalAmount : previousAmount;
  
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(displayAmount);
  }, [totalAmount, previousAmount]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [dispatch, userId,totalAmount]);

  useEffect(() => {
    if (typeof totalAmount === "number" && !isNaN(totalAmount) && totalAmount > 0) {
      setPreviousAmount(totalAmount);
    }
  }, [totalAmount]);

  // Process removal queue
  useEffect(() => {
    if (removalQueue.length > 0) {
      const timer = setTimeout(() => {
        const itemId = removalQueue[0];
        dispatch(removeItem({ userId, itemId }));
        setRemovalQueue(prev => prev.slice(1));
      }, 300); // 300ms delay between removals

      return () => clearTimeout(timer);
    }
  }, [removalQueue, dispatch, userId]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      timerRefs.current.forEach(timer => clearTimeout(timer));
      timerRefs.current = [];
    };
  }, []);

  // Hide button on cart page and checkout-related pages
  const hiddenPaths = ["/cart", "/checkout", "/payment","/profile","/orders","/previous-orders"];
  if (hiddenPaths.includes(location.pathname)) return null;

  const handleClick = () => {
    navigate("/cart");
  };







  return (
    <button className={styles.floatingButton} onClick={handleClick}>
      <div className={styles.buttonContent}>
        <span className={styles.cartIcon}>
        <svg height="48" viewBox="0 0 17 48" width="17" xmlns="http://www.w3.org/2000/svg">
        <path d="m13.4575 16.9268h-1.1353a3.8394 3.8394 0 0 0 -7.6444 0h-1.1353a2.6032 2.6032 0 0 0 -2.6 2.6v8.9232a2.6032 2.6032 0 0 0 2.6 2.6h9.915a2.6032 2.6032 0 0 0 2.6-2.6v-8.9231a2.6032 2.6032 0 0 0 -2.6-2.6001zm-4.9575-2.2768a2.658 2.658 0 0 1 2.6221 2.2764h-5.2442a2.658 2.658 0 0 1 2.6221-2.2764zm6.3574 13.8a1.4014 1.4014 0 0 1 -1.4 1.4h-9.9149a1.4014 1.4014 0 0 1 -1.4-1.4v-8.9231a1.4014 1.4014 0 0 1 1.4-1.4h9.915a1.4014 1.4014 0 0 1 1.4 1.4z"></path></svg>
          {cartItems.length > 0 && (
            <span className={styles.itemCount}>{cartItems.length}</span>
          )}
        </span>
        <span className={styles.buttonText}>
          {formattedTotal}
        </span>
      </div>
    </button>
  );
}

export default FloatingCartButton;