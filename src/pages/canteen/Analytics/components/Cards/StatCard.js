import styles from '../../../../../styles/Analytics.module.css';

const StatCard = ({ stat, loading }) => {

  const renderValueWithChange = (value, change) => {
    const isPositive = change >= 0;
    return (
      <>
        <h2 className={styles.title}>{value}</h2>
        <span className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
      </>
    );
  };

  return (
    <div className={styles.statCard}>
        <div className={styles.statHeader}>
          <span className={styles.statIcon}>{stat.icon}</span>
          <p className={styles.label}>{stat.label}</p>
        </div>
        {loading ? (
          <div className={`${styles.skeleton} ${styles.valueSkeleton}`} />
        ) : (
          renderValueWithChange(stat.value, stat.change)
        )}
      
    </div>
  );
};

export default StatCard;