import React, { useState, useEffect } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartItems } from "../../store/slices/cartSlice";
import userApi from "../../api/userApi";
import ModalPopup from "../../components/common/ModalPopup";
import styles from "../../styles/Payment.module.css";
import { addToast } from "../../store/slices/toastSlice";

function Payment() {
  const dispatch = useDispatch();
  const { cartItems = [], totalAmount = 0 } = useSelector((state) => state.cart || {});
  const { user } = useSelector((state) => state.auth || {});
  const userId = user?.id || null;

  const [cashfree, setCashfree] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkingStock, setCheckingStock] = useState(false);
  const [processing, setProcessing] = useState(false);

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
        response.data.messages.forEach((msg, index) => {
          setTimeout(() => {
            dispatch(
              addToast({
                id: Date.now() + index,
                type: "warning",
                message: msg,
                duration: 3000,
              })
            );
          }, index * 300);
        });
        return false;
      } else {
        dispatch(
          addToast({
            id: Date.now(),
            type: "success",
            message: response?.data?.message,
            duration: 3000,
          })
        );
        return true;
      }
    } catch (error) {
      console.error("Stock check error:", error);
      dispatch(
        addToast({
          id: Date.now(),
          type: "error",
          message: "Failed to check stock. Try again.",
          duration: 3000,
        })
      );
      return false;
    }
  };

  const handlePayNowClick = async () => {
    if (user?.canteen?.status === "inactive") {
      dispatch(
        addToast({
          id: Date.now(),
          type: "error",
          message: "Canteen closed. Payment unavailable. Try later.",
          duration: 3000,
        })
      );
      return;
    }

    setCheckingStock(true);
    const stockAvailable = await checkStockAvailability();
    setCheckingStock(false);

    if (stockAvailable) {
      setIsModalOpen(true);
      dispatch(fetchCartItems(userId));
    }
  };

  const getSessionId = async () => {
    try {
      const res = await userApi.getSessionId({
        totalAmount,
        userId: user.id,
        cartItems,
        canteenId: user.canteen._id,
        collegeId: user.college._id,
      });
      return res.data.sessionId;
    } catch (err) {
      console.error("Session error:", err);
      return null;
    }
  };

  const doPayment = async () => {
    setProcessing(true);
    const sessionId = await getSessionId();

    if (!sessionId) {
      dispatch(
        addToast({
          id: Date.now(),
          type: "error",
          message: "Unable to initiate payment. Try again.",
          duration: 3000,
        })
      );
      setProcessing(false);
      return;
    }

    if (!cashfree) {
      dispatch(
        addToast({
          id: Date.now(),
          type: "error",
          message: "Payment SDK not ready. Refresh the page.",
          duration: 3000,
        })
      );
      setProcessing(false);
      return;
    }

    cashfree.checkout({
      paymentSessionId: sessionId,
      redirectTarget: "_self",
    });

    // No need to reset processing, since user will be redirected
  };

  return (
    <>
      <div className={styles.buttonContainer}>
        <button
          className={styles.paymentButton}
          onClick={handlePayNowClick}
          disabled={checkingStock || processing}
        >
          {checkingStock
            ? "Checking stock..."
            : processing
            ? "Processing..."
            : `Pay Now Rs.${totalAmount}`}
        </button>
      </div>

      <ModalPopup
        isOpen={isModalOpen}
        title="Confirm Your Order"
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          doPayment();
        }}
      >
        <p>
          You are ordering from <strong>{user?.college?.name}</strong>,{" "}
          <strong>{user?.canteen?.name}</strong> canteen.
        </p>
        <div className={styles.modalButtonContainer}>
          <button
            onClick={doPayment}
            className={styles.paymentButton}
            disabled={processing}
          >
            {processing ? "Processing..." : "Proceed to Pay"}
          </button>
        </div>
      </ModalPopup>
    </>
  );
}

export default Payment;
