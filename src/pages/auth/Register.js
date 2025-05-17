import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import userApi from '../../api/userApi';
import styles from '../../styles/Register.module.css';
import { addToast } from '../../store/slices/toastSlice';
import { useDispatch } from 'react-redux';
import RegisterAnimationData from '../../animations/Register.json';
import Lottie from 'lottie-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      const response = await userApi.sendOtp({ email: email.trim() });
      setLoading(false);

      if (response.data.success) {
        setOtpSent(true);
        dispatch(addToast({
          id: Date.now(),
          type: 'success',
          message: response.data.message,
          duration: 3000,
        }));
      } else {
        dispatch(addToast({
          id: Date.now(),
          type: 'error',
          message: response.data.message,
          duration: 3000,
        }));
      }
    } catch (error) {
      setLoading(false);
      console.error('Error sending OTP:', error);
      dispatch(addToast({
        id: Date.now(),
        type: 'error',
        message: error.response.data.message || "Something went wrong.Please try later.",
        duration: 3000,
      }));
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !otp.trim()) {
      dispatch(addToast({
        id: Date.now(),
        type: 'warning',
        message: 'Email and OTP are required',
        duration: 3000,
      }));
      return;
    }

    try {
      setLoading(true);
      const response = await userApi.verifyOtp({ email: email.trim(), otp: otp.trim() });
      setLoading(false);

      if (response.data.success) {
        setOtpVerified(true);
        dispatch(addToast({
          id: Date.now(),
          type: 'success',
          message: response.data.message,
          duration: 3000,
        }));
      } else {
        dispatch(addToast({
          id: Date.now(),
          type: 'error',
          message: response.data.message,
          duration: 3000,
        }));
      }
    } catch (error) {
      setLoading(false);
      console.error('Error verifying OTP:', error);
      dispatch(addToast({
        id: Date.now(),
        type: 'error',
        message: 'Something went wrong. Please try later.',
        duration: 3000,
      }));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      dispatch(addToast({
        id: Date.now(),
        type: 'warning',
        message: 'Passwords do not match.',
        duration: 3000,
      }));
      return;
    }

    try {
      setLoading(true);
      const response = await userApi.register({
        email: email.trim(),
        password,
        username: username.trim(),
      });
      setLoading(false);

      if (response.data.success) {
        navigate("/login");
        dispatch(addToast({
          id: Date.now(),
          type: 'success',
          message: response.data.message,
          duration: 3000,
        }));
        console.log("Navigating....");
      } else {
        dispatch(addToast({
          id: Date.now(),
          type: 'error',
          message: response.data.message,
          duration: 3000,
        }));
      }
    } catch (error) {
      setLoading(false);
      console.error('Error setting password:', error);
      dispatch(addToast({
        id: Date.now(),
        type: 'error',
        message: 'Something went wrong. Please try later.',
        duration: 3000,
      }));
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.imageContainer}>
        <Lottie animationData={RegisterAnimationData} loop={true} style={{maxWidth:"500px" ,maxHeight:"500px" ,background : "white" }}/>
      </div>
      <div className={styles.registerContent}>
        <h2 className={styles.title}>Register</h2>
        <form
          onSubmit={
            otpSent && otpVerified
              ? handlePasswordSubmit
              : otpSent
              ? handleOtpSubmit
              : handleSendOtp
          }
          className={styles.registerForm}
        >
          {!otpVerified ? (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={otpSent}
                className={styles.input}
              />
              {otpSent && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className={styles.input}
                />
              )}
              <button
                type="submit"
                className={styles.registerButton}
                disabled={loading}
              >
                {loading
                  ? 'Please wait...'
                  : otpSent
                  ? 'Submit OTP'
                  : 'Next'}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={styles.input}
              />

              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.input}
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className={styles.passwordContainer}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={styles.input}
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button
                type="submit"
                className={styles.registerButton}
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Submit'}
              </button>
            </>
          )}
        </form>
        <p className={styles.registerFooter}>
          Already have an account?{' '}
          <button type="button" onClick={()=>navigate("/login")} className={styles.loginButton}>
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
