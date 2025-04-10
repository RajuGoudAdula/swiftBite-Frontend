import React from 'react';
import styles from '../../styles/Button.module.css';

const Button = ({ onClick, children, className }) => {
  return (
    <button className={`${styles.button} ${className || ''}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
