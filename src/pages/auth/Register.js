import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userApi from '../../api/userApi';
import styles from '../../styles/Register.module.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await userApi.sendOtp({ email });
      if (response.data.success) {
        setOtpSent(true);
        setMessage(response.data.message);
      } else {
        setMessage('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || !otp) {
        setMessage('Email and OTP are required.');
        return;
      }
      const response = await userApi.verifyOtp({ email, otp });
      if (response.data.success) {
        setOtpVerified(true);
        setMessage(response.data.message);
      } else {
        setMessage('Failed to verify email. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      const response = await userApi.register({ email, password, username });
      if (response.data.success) {
        setMessage('Registration successful! You can now log in.');
        navigate('/login');
      } else {
        setMessage('Failed to set password. Please try again.');
      }
    } catch (error) {
      console.error('Error setting password:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.registerContainer}>
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
            <button type="submit" className={styles.registerButton}>
              {otpSent ? 'Submit OTP' : 'Next'}
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
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.registerButton}>
              Submit
            </button>
          </>
        )}
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Register;
