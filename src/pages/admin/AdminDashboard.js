import React, { useEffect, useState } from 'react';
import { FaBox, FaUniversity, FaStore, FaClipboardList, FaTags } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/AdminDashboard.module.css';
import adminApi from '../../api/adminApi';
import moment from 'moment'; // Make sure to install it: npm install moment

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsResponse = await adminApi.getAdminStats();
        const activityResponse = await adminApi.getRecentActivity();
       

        setStats(statsResponse.data.stats || []);

        const { recentOrders = [], recentCanteens = [], recentColleges = [],recentProduct=[] } = activityResponse.data;

        const formattedActivities = [
          ...recentOrders.map(order => ({
            message: `Order placed at ${order.canteenId?.name || "Unknown Canteen"} (${order.collegeId?.name || "Unknown College"})`,
            time: moment(order.createdAt).fromNow()
          })),
          ...recentCanteens.map(canteen => ({
            message: `Canteen "${canteen.name}" registered`,
            time: moment(canteen.createdAt).fromNow()
          })),
          ...recentColleges.map(college => ({
            message: `College "${college.name}" added`,
            time: moment(college.createdAt).fromNow()
          })),
          ...recentProduct.map(product => ({
            message:`${product.name} added successfully.`,
            time :  moment(product.createdAt).fromNow()
          }))
        ];
        const sortedActivities = formattedActivities.sort((a, b) => new Date(b.time) - new Date(a.time));

        setActivities(sortedActivities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

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
            <span className={`${styles.statChange} ${stat.positive ? styles.positive : styles.negative}`}>
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
          {activities.length > 0 ? activities.map((activity, index) => (
            <div key={index} className={styles.activityItem}>
              <div className={styles.activityDot}></div>
              <div>
                <p>{activity.message}</p>
                <small>{activity.time}</small>
              </div>
            </div>
          )) : <p>No recent activity</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
