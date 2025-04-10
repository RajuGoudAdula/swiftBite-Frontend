import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchCartItems, removeItem } from "../../store/slices/cartSlice";
import styles from "../../styles/FloatingButton.module.css";

function FloatingCartButton() {
  const { totalAmount=0, items = [] } = useSelector((state) => state.cart || {});
  const { user } = useSelector((state) => state.auth || {});
  const userId = user?.id || null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const timerRefs = useRef([]);

  // Queue system for item removal
  const [removalQueue, setRemovalQueue] = useState([]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [dispatch, userId,totalAmount]);

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
  const hiddenPaths = ["/cart", "/checkout", "/payment"];
  if (hiddenPaths.includes(location.pathname)) return null;

  const handleClick = () => {
    navigate("/cart");
  };

  // Format total amount with proper currency formatting
  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(totalAmount);

  // Function to queue item removal
  const handleRemoveItem = (itemId) => {
    setRemovalQueue(prev => [...prev, itemId]);
  };

  return (
    <button className={styles.floatingButton} onClick={handleClick}>
      <div className={styles.buttonContent}>
        <span className={styles.cartIcon}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 3c0 .55.45 1 1 1h1l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h11c.55 0 1-.45 1-1s-.45-1-1-1H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.67-1.43c-.16-.35-.52-.57-.9-.57H2c-.55 0-1 .45-1 1zm16 15c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          {items.length > 0 && (
            <span className={styles.itemCount}>{items.length}</span>
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