import React, { useEffect, useRef, useState } from 'react';

const OTPInput = ({ onSubmit, email }) => {
  const [otpDigits, setOtpDigits] = useState(new Array(6).fill(''));
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0].focus();
  }, []);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Move focus to next input
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }

    // Auto submit if all digits are filled
    if (newOtpDigits.every((digit) => digit !== '')) {
      const otp = newOtpDigits.join('');
      onSubmit(email, otp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
      {otpDigits.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputsRef.current[index] = el)}
          style={{
            width: '40px',
            height: '40px',
            textAlign: 'center',
            fontSize: '20px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      ))}
    </div>
  );
};

export default OTPInput;
