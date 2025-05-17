import React, {  useEffect, useState } from 'react';
import styles from '../../styles/AuthPage.module.css';
import Login from './Login';
import Register from './Register';


const AuthPage = ({ initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');

  useEffect(()=>{
    setIsLogin(initialMode);
  },[initialMode]);
  
  return (
    <div className={styles.container}>
      {isLogin === "login" ? (
        <div className={`${styles.authComponent} ${styles.loginEnter}`}>
          <Login />
        </div>
      ) : (
        <div className={`${styles.registerEnter}`}>
          <Register />
        </div>
      )}
    </div>
  );
  
};

export default AuthPage;
