import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import userApi from "../../api/userApi";
import { motion, AnimatePresence } from "framer-motion";
import styles from '../../styles/PaymentStatus.module.css';

const PaymentStatus = () => {
  const location = useLocation();
  const [status, setStatus] = useState("Checking payment status...");
  const [statusType, setStatusType] = useState("checking");
  const [loading, setLoading] = useState(true);
  const [icon, setIcon] = useState("⏳");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("order_id");

    const checkStatus = async () => {
      if (!orderId) {
        setStatus("Invalid order ID");
        setStatusType("failed");
        setIcon("❌");
        setLoading(false);
        return;
      }

      try {
        const response = await userApi.getPaymentStatus(orderId);
        const paymentStatus = response.data.paymentStatus;
        
        if (paymentStatus === "Paid") {
          setStatus("Payment Successful");
          setStatusType("success");
          setIcon("✅");
        } else if (paymentStatus === "FAILED") {
          setStatus("Payment Failed");
          setStatusType("failed");
          setIcon("❌");
        } else {
          setStatus("Payment Pending");
          setStatusType("pending");
          setIcon("⏳");
        }
      } catch (error) {
        console.error("Error fetching payment status:", error);
        setStatus("Error checking payment status");
        setStatusType("failed");
        setIcon("⚠️");
      } finally {
        setLoading(false);
      }
    };

    // Add slight delay for better animation flow
    const timer = setTimeout(checkStatus, 800);
    return () => clearTimeout(timer);
  }, [location]);

  // Apple-like animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 10, stiffness: 100 }
    }
  };

  const checkmarkVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  };

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.card}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className={styles.loadingContainer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={styles.spinner}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              <motion.p variants={itemVariants}>Verifying payment</motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="status"
              className={styles.statusContainer}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className={`${styles.iconContainer} ${styles[statusType]}`}
                variants={itemVariants}
              >
                {statusType === "success" ? (
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      d="M20 40L35 55L60 25"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={checkmarkVariants}
                    />
                  </svg>
                ) : (
                  <span className={styles.statusIcon}>{icon}</span>
                )}
              </motion.div>
              
              <motion.h1 
                className={styles.statusTitle}
                variants={itemVariants}
              >
                {status}
              </motion.h1>
              
              <motion.p 
                className={styles.statusMessage}
                variants={itemVariants}
              >
                {statusType === "success" 
                  ? "Your payment was processed successfully."
                  : statusType === "failed" 
                  ? "Please try again or contact support."
                  : "We'll notify you when payment is confirmed."}
              </motion.p>
              
              <motion.div variants={itemVariants}>
                <button className={styles.actionButton}>
                  {statusType === "success" ? "View Order" : "Try Again"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PaymentStatus;