import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartItems } from "../../store/slices/cartSlice";
import Lottie from "lottie-react";
import animationData from "../../animations/cartIsEmpty.json";
import styles from "../../styles/Cart.module.css";
import Payment from "../user/Payment";
import SwiftBiteLoader from "../../components/common/SwiftBiteLoader";
import CartItem from "./CartItem";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems = [], totalAmount = 0, loading, error } = useSelector((state) => state.cart || {});
  const { user } = useSelector((state) => state.auth || {});
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [dispatch, userId]);

  const renderedItems = useMemo(
    () =>
      cartItems.map((item) => (
        <CartItem key={item.productId._id} item={item} userId={userId} />
      )),
    [cartItems, userId]
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Cart</h2>

      {loading ? (
        <SwiftBiteLoader info="Loading Your Cart..." />
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : cartItems?.length === 0 ? (
        <>
          <p className={styles.empty}>Your cart is empty.</p>
          <div className={styles.animationWrapper}>
            <Lottie animationData={animationData} loop={true} style={{ maxWidth: "500px", maxHeight: "500px" }} />
          </div>
        </>
      ) : (
        <div className={styles.cartContainer}>{renderedItems}</div>
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
