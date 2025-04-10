import React from 'react';
import styles from '../../../../../styles/Analytics.module.css';

const ChartCard = ({ title, children }) => {
  return (
    <div className={styles.mainChartCard}>
      <h2 className={styles.chartTitle}>{title}</h2>
      {children}
    </div>
  );
};

export default ChartCard;