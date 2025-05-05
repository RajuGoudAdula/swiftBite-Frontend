import React, { useState } from 'react';
import styles from '../../styles/CanteenClosedBanner.module.css';

const CanteenClosedBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className={styles.banner}>
      <h1>Canteen is Closed at the Moment</h1>
      <p>We're currently not accepting orders. Please check back soon during our operating hours.</p>
      <button className={styles.button} onClick={() => setVisible(false)}>Dismiss</button>
    </div>
  );
};

export default CanteenClosedBanner;
