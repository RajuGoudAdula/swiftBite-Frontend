import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Lottie from 'lottie-react';
import animationData from '../../animations/unauthorized.json'; // Update this path to your Lottie file
import styles from '../../styles/Unauthorized.module.css'; // Import CSS module

const Unauthorized = () => {
  const { role } = useSelector((state) => state.auth || {});

  return (
    <div className={styles.container}>
      <h2>Unauthorized Access</h2>
      <p>You do not have permission to access this page.</p>
      
      {/* Lottie Animation */}
      <div className={styles.animationWrapper}>
        <Lottie animationData={animationData} loop={true} style={{maxWidth:"500px" ,maxHeight:"500px" }}/>
      </div>

      {/* Links based on user role */}
      <div className={styles.links}>
        {role === "user" && <Link className={styles.link} to="/">Go to Home</Link>}
        {role === "canteen" && <Link className={styles.link} to="/canteen/dashboard">Go to Home</Link>}
        {role === "admin" && <Link className={styles.link} to="/admin/dashboard">Go to Home</Link>}
      </div>
    </div>
  );
};

export default Unauthorized;
