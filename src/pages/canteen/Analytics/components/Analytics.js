// src/pages/canteen/Analytics/Analytics.js
import React, { useEffect, useState } from 'react';
import { FiRefreshCw, FiDownload, } from 'react-icons/fi'; // Add all needed icons
import styles from '../../../../styles/Analytics.module.css';
import canteenApi from "../../../../api/canteenApi";
import OverviewSection from './sections/OverviewSection';
import SalesSection from './sections/SalesSection';
import UsersSection from './sections/UsersSection';
import ProductsSection from './sections/ProductsSection';
import ReviewsSection from './sections/ReviewsSection';
import Tabs from './Common/Tabs';
import DateRangePicker from './Common/DateRangePicker';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');

  // State for all data
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [salesData, setSalesData] = useState({});
  const [usersData, setUsersData] = useState({});
  const [productsData, setProductsData] = useState({});
  const [reviewsData, setReviewsData] = useState([]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const [statsRes, chartRes, pieRes, salesRes, usersRes, productsRes, reviewsRes] = await Promise.all([
        canteenApi.fetchStats(),
        canteenApi.fetchChartData({ range: timeRange }),
        canteenApi.fetchPieData(),
        canteenApi.fetchSalesData({ range: timeRange }),
        canteenApi.fetchUsersData({ range: timeRange }),
        canteenApi.fetchProductsData(),
        canteenApi.fetchReviewsData()
      ]);
      
      setStats(statsRes.data);
      setChartData(chartRes.data);
      setPieData(pieRes.data);
      setSalesData(salesRes.data);
      setUsersData(usersRes.data);
      setProductsData(productsRes.data);
      setReviewsData(reviewsRes.data);
      
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [timeRange, activeTab]);

  const handleRefresh = () => {
    fetchAllData();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewSection 
          loading={loading} 
          stats={stats} 
          chartData={chartData} 
          pieData={pieData} 
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />;
      case 'sales':
        return <SalesSection loading={loading} salesData={salesData} />;
      case 'users':
        return <UsersSection loading={loading} usersData={usersData} />;
      case 'products':
        return <ProductsSection loading={loading} productsData={productsData} />;
      case 'reviews and rating':
        return <ReviewsSection 
          loading={loading} 
          reviewsData={reviewsData} 
          setReviewsData={setReviewsData} 
        />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Analytics</h1>
          <p className={styles.subheading}>Insights and metrics at a glance</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={handleRefresh}>
            <FiRefreshCw size={18} />
          </button>
          <button className={styles.actionButton} onClick={() => alert('Exporting analytics data...')}>
            <FiDownload size={18} />
          </button>
          <DateRangePicker 
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </div>
      </div>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className={styles.tabContentContainer}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Analytics;