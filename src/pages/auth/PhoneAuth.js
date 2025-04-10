import React, { useState } from "react";
import { auth } from "../../utils/firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // 🔹 Step 1: Send OTP
  const sendOtp = () => {
    setError("");

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }

    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmation) => {
        setConfirmationResult(confirmation);
        alert("OTP Sent!");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  // 🔹 Step 2: Verify OTP
  const verifyOtp = () => {
    setError("");
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    confirmationResult
      .confirm(otp)
      .then((result) => {
        setUser(result.user);
        alert("Phone number verified successfully!");
      })
      .catch(() => {
        setError("Invalid OTP. Please try again.");
      });
  };

  return (
    <div>
      <h2>Phone Number Authentication</h2>

      {!user ? (
        <>
          {/* Phone Input */}
          <input
            type="text"
            placeholder="Enter Phone Number (+91XXXXXXXXXX)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>

          {/* OTP Input (Shown after OTP is sent) */}
          {confirmationResult && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button onClick={verifyOtp}>Verify OTP</button>
            </>
          )}

          {/* Display Errors */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* Firebase reCAPTCHA */}
          <div id="recaptcha-container"></div>
        </>
      ) : (
        <h3>✅ Phone Verified! Welcome, {user.phoneNumber}</h3>
      )}
    </div>
  );
};

export default PhoneAuth;
