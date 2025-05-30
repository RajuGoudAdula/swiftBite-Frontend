import React, { useEffect, useState, useCallback, useMemo } from "react";
import styles from "../../styles/Cart.module.css";
import { useDispatch } from "react-redux";
import { updateQuantity, removeItem } from "../../store/slices/cartSlice";
import { addToast } from "../../store/slices/toastSlice";

const CartItem = React.memo(({ item, userId }) => {
  const dispatch = useDispatch();
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  const { itemId, productName, offer, price, discountedPrice } = useMemo(() => {
    const itemId = item.productId._id;
    const productName = item.productId.name;
    const offer = item.itemId?.offers?.[0];
    const price = item.itemId?.price;
    const discountedPrice = offer ? price - (price * offer.discount) / 100 : price;

    return { itemId, productName, offer, price, discountedPrice };
  }, [item]);

  // ✅ Debounce logic to prevent rapid dispatching
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localQuantity !== item.quantity) {
        dispatch(updateQuantity({ userId, itemId, quantity: localQuantity }));
      }
    }, 500); // 500ms debounce delay (adjustable)

    return () => clearTimeout(timeout);
  }, [localQuantity, dispatch, userId, item.quantity, itemId]);

  // ✅ Increase and decrease with local state only
  const increase = useCallback(() => {
    setLocalQuantity((prev) => prev + 1);
  }, []);

  const decrease = useCallback(() => {
    setLocalQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  // ✅ Remove item with toast feedback
  const handleRemove = useCallback(() => {
    dispatch(removeItem({ userId, itemId }))
      .unwrap()
      .then(() => {
        dispatch(
          addToast({
            id: Date.now(),
            type: "success",
            message: `${productName} removed`,
            duration: 3000,
          })
        );
      })
      .catch(() => {
        dispatch(
          addToast({
            id: Date.now(),
            type: "error",
            message: `Failed to remove ${productName}`,
            duration: 3000,
          })
        );
      });
  }, [dispatch, userId, itemId, productName]);

  return (
    <div className={styles.item}>
      <img src={item.productId.image} alt={productName} className={styles.itemImage} />

      <div className={styles.itemDetails}>
        <div className={styles.itemName}>
          <h4 className={styles.itemTitle}>{productName}</h4>
          {offer && <span className={styles.discountText}>{offer.discount}% OFF</span>}

          <div className={styles.pricing}>
            {offer ? (
              <>
                <span className={styles.currentPrice}>₹{discountedPrice}</span>
                <span className={styles.originalPrice}>₹{price}</span>
              </>
            ) : (
              <span className={styles.currentPrice}>₹{price}</span>
            )}
          </div>
        </div>

        <div className={styles.quantityControls}>
          <button onClick={decrease} className={styles.quantityButton}>
            <svg className={styles.quantityIcon} viewBox="0 0 24 24">
              <path d="M5 12h14" />
            </svg>
          </button>
          <span className={styles.quantity}>{localQuantity}</span>
          <button onClick={increase} className={styles.quantityButton}>
            <svg className={styles.quantityIcon} viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        <button onClick={handleRemove} className={styles.deleteButton}>
          <svg
            className={styles.deleteIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
          </svg>
        </button>
      </div>
    </div>
  );
});

export default CartItem;
