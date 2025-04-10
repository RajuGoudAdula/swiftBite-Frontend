import React from 'react';
import { FaBox, FaUniversity, FaStore, FaClipboardList, FaTags } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/AdminDashboard.module.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { title: "Total Products", value: 120, change: "+10%", positive: true },
    { title: "Registered Colleges", value: 35, change: "+2%", positive: true },
    { title: "Active Canteens", value: 22, change: "-1%", positive: false },
    { title: "Pending Orders", value: 15, change: "+5%", positive: true }
  ];

  const quickActions = [
    {
      icon: <FaBox size={24} />,
      title: "Manage Products",
      description: "Add or edit food items",
      action: () => navigate('/admin/products')
    },
    {
      icon: <FaUniversity size={24} />,
      title: "Manage Colleges",
      description: "Add or remove colleges",
      action: () => navigate('/admin/colleges')
    },
    {
      icon: <FaStore size={24} />,
      title: "Manage Canteens",
      description: "View or update canteens",
      action: () => navigate('/admin/canteens')
    },
    {
      icon: <FaClipboardList size={24} />,
      title: "View Orders",
      description: "See all orders placed",
      action: () => navigate('/admin/orders')
    },
    {
      icon: <FaTags size={24} />,
      title: "Manage Offers",
      description: "Post offers or ads",
      action: () => navigate('/admin/offers')
    }
  ];

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>Welcome Admin! Here's an overview of system activity.</p>
      </header>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <h3>{stat.title}</h3>
            <p className={styles.statValue}>{stat.value}</p>
            <span className={`${styles.statChange} ${stat.positive === undefined ? '' : stat.positive ? styles.positive : styles.negative}`}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Quick Actions</h2>
      <div className={styles.actionsGrid}>
        {quickActions.map((action, index) => (
          <button
            key={index}
            className={styles.actionCard}
            onClick={action.action}
          >
            <div className={styles.actionIcon}>{action.icon}</div>
            <h3>{action.title}</h3>
            <p>{action.description}</p>
          </button>
        ))}
      </div>

      <div className={styles.recentActivity}>
        <h2>Recent Activity</h2>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityDot}></div>
            <div>
              <p>New canteen registered: XYZ Canteen</p>
              <small>10 minutes ago</small>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityDot}></div>
            <div>
              <p>Offer added: 10% off on breakfast</p>
              <small>1 hour ago</small>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityDot}></div>
            <div>
              <p>Order #789 processed</p>
              <small>3 hours ago</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
