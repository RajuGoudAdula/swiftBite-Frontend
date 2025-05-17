import React, { useState, useEffect } from "react";
import { load } from '@cashfreepayments/cashfree-js';
import { useSelector, useDispatch } from "react-redux";
import { fetchCartItems } from "../../store/slices/cartSlice";
import userApi from "../../api/userApi";
import ModalPopup from "../../components/common/ModalPopup"; // Import the modal component
import styles from '../../styles/Payment.module.css';
import { addToast } from "../../store/slices/toastSlice";

function Payment() {
  const dispatch = useDispatch();
  const { cartItems = [], totalAmount = 0 } = useSelector((state) => state.cart || {});
  const { user } = useSelector((state) => state.auth || {});
  const userId = user?.id || null;
  const [cashfree, setCashfree] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [isStockAvailable,setIsStockAvailable] = useState(false);

  let sessionId;

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const initializeSDK = async () => {
      const cf = await load({ mode: "sandbox" });
      setCashfree(cf);
    };
    initializeSDK();
  }, []);

  const checkStockAvailability = async () => {
    try {
      const response = await userApi.checkStock(userId);
  
      if (response?.data?.messages?.length > 0) {
        setIsStockAvailable(false);
        
        response.data.messages.forEach((message , index) => {
          setTimeout(() => {
            dispatch(addToast({
              id: Date.now() + Math.random(),
              type: 'warning',
              message,
              duration: 3000,
            }));
          }, index * 500);
        });
  
      } else if(response?.data?.message){
        dispatch(addToast({
          id: Date.now() + Math.random(), 
          type: 'success',
          message : response?.data?.message,
          duration: 3000,
        }));
        setIsStockAvailable(true);
      }
  
    } catch (error) {
      console.error("Error checking stock:", error);
      dispatch(addToast({
        id: Date.now(),
        type: 'error',
        message: 'Failed to check stock. Please try again.',
        duration: 3000,
      }));
      setIsStockAvailable(false); // Optional fallback
    }
  };

  const doPayment = async () => {
    if(!isStockAvailable){
      checkStockAvailability();
      return;
    }

    await getSessionId();

    if (!sessionId) {
      console.error("Session ID is not available");
      return;
    }

    if (!cashfree) {
      console.error("Cashfree SDK is not initialized");
      return;
    }

    let checkoutOptions = {
      paymentSessionId: sessionId,
      redirectTarget: "_self",
    };
    cashfree.checkout(checkoutOptions);
  };

  const getSessionId = async () => {
    try {
      const response = await userApi.getSessionId({
        totalAmount,
        userId: user.id,
        cartItems,
        canteenId: user.canteen._id,
        collegeId: user.college._id
      });
      sessionId = response.data.sessionId;
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      <div className={styles.buttonContainer}>
        <button className={styles.paymentButton} onClick={() => {
            if(user?.canteen?.status === "inactive"){
              dispatch(addToast({
                id: Date.now(),
                type: 'error',
                message: 'Canteen closed. Payment unavailable. Try later.',
                duration: 3000,
              }));
              return;
            }
          setIsModalOpen(true)
          dispatch(fetchCartItems(userId));
          
          }}>
          <span className={styles.buttonText}>Pay Now Rs.{totalAmount}</span>
        </button>
      </div>

      {/* Modal for Confirmation */}
      <ModalPopup
        isOpen={isModalOpen}
        title="Confirm Your Order"
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          doPayment();
        }}
      >
        <p>You are ordering from <strong>{user?.college?.name}</strong> , <strong>{user?.canteen?.name}</strong> canteen.</p>
        <div className={styles.modalButtonContainer}>
          <button onClick={doPayment} className={styles.paymentButton} >Proceed to Pay</button>
        </div>
      </ModalPopup>
    </>
  );
}

export default Payment;
