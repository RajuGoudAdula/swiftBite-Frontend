import React, { useState } from 'react';
import styles from '../../styles/AuthPage.module.css';
import Login from './Login';
import Register from './Register';
import LoginAnimationData from '../../animations/Login.json';
import RegisterAnimationData from '../../animations/Register.json';
import Lottie from 'lottie-react';

const AuthPage = ({ initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');

  const toggleAuthMode = () => {
    setIsLogin(prev => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.authBox} ${isLogin ? styles.loginMode : styles.registerMode}`}>
        <div className={styles.imageContainer}>
          {isLogin ? (
            <Lottie animationData={LoginAnimationData} loop={true} style={{maxWidth:"500px" ,maxHeight:"500px",background : "white" }}/>
          ) : (
            <Lottie animationData={RegisterAnimationData} loop={true} style={{maxWidth:"500px" ,maxHeight:"500px" ,background : "white" }}/>
          )}
        </div>

        <div className={styles.formContainer}>
          {/* Login Form */}
          <div className={`${styles.form} ${isLogin ? styles.active : ''}`}>
            <Login />
            <p className={styles.toggleLink}>
              Don't have an account?{' '}
              <button type="button" onClick={toggleAuthMode} className={styles.toggleButton}>
                Register here
              </button>
            </p>
          </div>

          {/* Register Form */}
          <div className={`${styles.form} ${!isLogin ? styles.active : ''}`}>
            <Register />
            <p className={styles.toggleLink}>
              Already have an account?{' '}
              <button type="button" onClick={toggleAuthMode} className={styles.toggleButton}>
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
