import React, { useEffect, useState } from 'react';
import { FaUtensils, FaClipboardList, FaChartLine, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/CanteenDashboard.module.css';
import canteenApi from "../../api/canteenApi";
import { addToast } from "../../store/slices/toastSlice";
import { useDispatch, useSelector } from 'react-redux';

const CanteenDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [canteenStatus,setCanteenStatus] = useState("");
  const { user } = useSelector((state) => state.auth || {});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const todayOrdersRes = await canteenApi.todayOrders();
        const pendingOrdersRes = await canteenApi.pendingOrders();
        const revenueRes = await canteenApi.revenue();
        const activityRes = await canteenApi.activity();
       
  
        setStats([
          {
            title: "Today's Orders",
            value: todayOrdersRes?.data?.count ?? 0,
            change: todayOrdersRes?.data?.change ?? '0%',
            positive: todayOrdersRes?.data?.positive ?? true
          },
          {
            title: "Today's Pending Orders",
            value: pendingOrdersRes?.data?.count ?? 0,
            change: pendingOrdersRes?.data?.change ?? '0%',
            positive: pendingOrdersRes?.data?.positive ?? true
          },
          {
            title: "Today's Total Revenue",
            value: `₹${(revenueRes?.data?.revenue ?? 0).toLocaleString()}`,
            change: revenueRes?.data?.change ?? '0%',
            positive: revenueRes?.data?.positive ?? true
          },
          
        ]);
  
        setRecentActivity(activityRes?.data ?? []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
  
    fetchDashboardData();
  }, []);

  const handleCanteenStatus = async () => {
    try {
      const response = await canteenApi.toggleCanteenStatus(user?.canteen?._id);
      const newStatus = response?.data?.status;
  
      setCanteenStatus(newStatus);
  
      dispatch(addToast({
        id: Date.now(),
        type: 'success',
        message: `Canteen has been ${newStatus === 'active' ? 'opened' : 'closed'}.`,
        duration: 3000,
      }));
    } catch (error) {
      console.error("Failed to toggle canteen status:", error);
  
      dispatch(addToast({
        id: Date.now(),
        type: 'error',
        message: 'Failed to change canteen status. Please try again.',
        duration: 3000,
      }));
    }
  };
  

  useEffect( ()=>{
    const fetchStatus = async () => {
      const currentStatus =await  canteenApi.getCanteenStatus(user?.canteen?._id);
      setCanteenStatus(currentStatus?.data?.status);
    }
    fetchStatus();
  },[]);
  

  const quickActions = [
    {
      icon: <FaUtensils size={24} />,
      title: "Manage Menu",
      description: "Add or update menu items",
      action: () => navigate('/canteen/menu')
    },
    {
      icon: <FaClipboardList size={24} />,
      title: "View Orders",
      description: "See current and past orders",
      action: () => navigate('/canteen/orders')
    },
    {
      icon: <FaChartLine size={24} />,
      title: "Analytics",
      description: "View sales and trends",
      action: () => navigate('/canteen/analytics')
    },
    {
      icon: <FaCog size={24} />,
      title: "Settings",
      description: "Update canteen details",
      action: () => navigate('/canteen/settings')
    }
  ];

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
       <div>
        <h1>Canteen Dashboard</h1>
        <p>Welcome back! Here's what's happening today.</p>
       </div>
       <div className={styles.toggleWrapper}>
          <span className={styles.label}>
            {canteenStatus === 'active' ? 'Open' : 'Closed'}
          </span>
          <div
            className={`${styles.toggle} ${
              canteenStatus === 'active' ? styles.active : ''
            }`}
            onClick={handleCanteenStatus}
          >
            <div className={styles.slider}></div>
          </div>
       </div>
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
          <button key={index} className={styles.actionCard} onClick={action.action}>
            <div className={styles.actionIcon}>{action.icon}</div>
            <h3>{action.title}</h3>
            <p>{action.description}</p>
          </button>
        ))}
      </div>

      <div className={styles.recentActivity}>
        <h2>Recent Activity</h2>
        <div className={styles.activityList}>
          {recentActivity.map((activity, index) => (
            <div key={index} className={styles.activityItem}>
              <div className={styles.activityDot}></div>
              <div>
                <p>{activity.message}</p>
                <small>{activity.timeAgo}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CanteenDashboard;
