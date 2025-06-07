import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/toastSlice';
import { userAllNotifications } from '../../store/slices/notificationSlice';
import LoginAnimationData from '../../animations/Login.json';
import userApi from '../../api/userApi';
import styles from '../../styles/Login.module.css';
import Lottie from 'lottie-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userApi.login({ email, password });

      if (response?.data?.success) {
        dispatch(loginSuccess({
          user: response.data?.user,
          token: response.data?.token,
        }));

        dispatch(addToast({
          id: Date.now(),
          type: 'success',
          message: 'Welcome! You are now logged in.',
          duration: 3000,
        }));

        dispatch(userAllNotifications(response.data?.user?.id));

        const role = response.data?.user?.role;
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'canteen') navigate('/canteen/dashboard');
        else navigate('/');
      } else {
        dispatch(addToast({
          id: Date.now(),
          type: 'error',
          message: 'Login failed. Check your credentials and try again.',
          duration: 3000,
        }));
      }
    } catch (error) {
      console.log(error);
      dispatch(addToast({
        id: Date.now(),
        type: 'error',
        message: error?.response?.data?.message || 'Login failed. Please try again.',
        duration: 3000,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await userApi.googleLogin({ token: response.credential });

      if (res?.data?.success) {
        dispatch(loginSuccess({
          user: res.data.user,
          token: res.data.token,
        }));

        dispatch(addToast({
          id: Date.now(),
          type: 'success',
          message: 'Welcome! You are now logged in.',
          duration: 3000,
        }));

        const role = res.data.user.role;
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'canteen') navigate('/canteen/dashboard');
        else navigate('/');
      } else {
        dispatch(addToast({
          id: Date.now(),
          type: 'error',
          message: res.data.message || 'Google login failed.',
          duration: 3000,
        }));
      }
    } catch (error) {
      console.error('Google login error:', error);
      dispatch(addToast({
        id: Date.now(),
        type: 'error',
        message: 'Google login failed. Please try again.',
        duration: 3000,
      }));
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContent}>
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

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className={styles.googleLogin}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() =>
              dispatch(addToast({
                id: Date.now(),
                type: 'error',
                message: 'Google login failed.',
                duration: 3000,
              }))
            }
          />
        </div>
        <p className={styles.loginFooter}>
          Don't have an account?{' '}
          <button type="button" onClick={()=>navigate("/register")} className={styles.registerButton}>
            Register here
          </button>
        </p>
      </div>
      <div className={styles.imageContainer}>
       <Lottie animationData={LoginAnimationData} loop={true} style={{maxWidth:"500px" ,maxHeight:"500px",background : "white" }}/>
      </div>
    </div>
  );
};

export default Login;
