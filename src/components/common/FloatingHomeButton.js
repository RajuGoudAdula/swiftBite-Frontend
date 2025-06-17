import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react'; // Home icon
import styles from "../../styles/FloatingHomeButton.module.css";

function FloatingHomeButton() {
  const { user } = useSelector((state) => state.auth || {});
  const navigate = useNavigate();

  const handleClick = () => {
    if (user?.role === "user") {
      navigate("/");
    } else if (user?.role === "canteen") {
      navigate("/canteen/dashboard");
    } else if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/"); // fallback
    }
  };



  return (
    <button className={`${styles.floatingButton} ${styles[user?.role]}`} onClick={handleClick} aria-label="Go Home">
        <div className={styles.buttonContent}>
                <span className={styles.cartIcon}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5m4 0h5a1 1 0 001-1V10"
                    />
                </svg>
                </span>
        </div>
    </button>
  );
}

export default FloatingHomeButton;
