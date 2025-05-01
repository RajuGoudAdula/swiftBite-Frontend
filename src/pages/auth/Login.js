import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';
import userApi from '../../api/userApi';
import styles from '../../styles/Login.module.css'; // ✅ CSS Module import
import { addToast } from '../../store/slices/toastSlice';
import { userAllNotifications } from '../../store/slices/notificationSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await userApi.login({ email, password });
      if (response?.data?.success) {
        dispatch(loginSuccess({
          user: response?.data?.user,
          token: response?.data?.token,
        }))
       dispatch(addToast(
                  {id: Date.now(),
                  type: 'success',
                  message: `Welcome! You are now logged in.`,
                  duration: 3000,}
                ));

        dispatch(userAllNotifications(response?.data?.user?.id));
             
        if (response?.data?.user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (response?.data?.user?.role === 'canteen') {
          navigate('/canteen/dashboard');
        } else {
          navigate('/');
        }
      } else {
        // alert('Invalid credentials. Please try again.');
        dispatch(addToast({
          id: Date.now(),
          type: 'error',
          message: `Login failed. Check your credentials and try again.`,
          duration: 3000,
        }));
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch(addToast({
        id: Date.now(),
        type: 'error',
        message: error?.response?.data?.message,
        duration: 3000,
      }));
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await userApi.googleLogin({ token: response.credential });

      if (res?.data?.success) {
        dispatch(loginSuccess({
          user: res?.data?.user,
          token: res?.data?.token,
        }))
          dispatch(addToast(
            {id: Date.now(),
            type: 'success',
            message: `Welcome! You are now logged in.`,
            duration: 3000,}
          ));
        if (res?.data?.user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (res?.data?.user?.role === 'canteen') {
          navigate('/canteen/dashboard');
        } else {
          navigate('/');
        }
      } else {
        alert(res?.data?.message);
      }
    } catch (error) {
      console.error('Google login error:', error);
      // alert('Google login failed. Please try again.');
      dispatch(addToast({
        id: Date.now(),
        type: 'error',
        message: `Google login failed. Please try again.`,
        duration: 3000,
      }));
 

    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Login</h2>

      <form onSubmit={handleLogin} className={styles.loginForm}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.loginButton}>Login</button>
      </form>

      <div className={styles.googleLogin}>
        <GoogleLogin
          onSuccess={(credentialResponse) => handleGoogleSuccess(credentialResponse)}
          onError={() => alert('Google Login Failed')}
        />
      </div>
    </div>
  );
};

export default Login;
