// src/pages/canteen/Analytics/components/Common/Tabs.js
import styles from '../../../../../styles/Analytics.module.css';

const Tabs = ({ activeTab, setActiveTab }) => (
  <div className={styles.tabs}>
    {['overview', 'sales', 'users', 'products', 'reviews and rating'].map(tab => (
      <button
        key={tab}
        className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
        onClick={() => setActiveTab(tab)}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    ))}
  </div>
);

export default Tabs;