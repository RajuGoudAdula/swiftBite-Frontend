// src/pages/canteen/Analytics/components/Cards/StatCard.js
import { FiShoppingCart, FiDollarSign, FiUser, FiTrendingUp } from 'react-icons/fi';
import styles from '../../../../../styles/Analytics.module.css';

const StatCard = ({ stat, loading }) => {
  const icons = {
    'Total Orders': <FiShoppingCart />,
    'Total Revenue': <FiDollarSign />,
    'Active Users': <FiUser />,
    'Conversion Rate': <FiTrendingUp />
  };

  const renderValueWithChange = (value, change) => {
    const isPositive = change >= 0;
    return (
      <div className={styles.valueContainer}>
        <h2 className={styles.value}>{value}</h2>
        <span className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
      </div>
    );
  };

  return (
    <div className={styles.statCard}>
      <div className={styles.cardContent}>
        <div className={styles.statHeader}>
          <span className={styles.statIcon}>{icons[stat.label]}</span>
          <p className={styles.label}>{stat.label}</p>
        </div>
        {loading ? (
          <div className={`${styles.skeleton} ${styles.valueSkeleton}`} />
        ) : (
          renderValueWithChange(stat.value, stat.change)
        )}
      </div>
    </div>
  );
};

export default StatCard;