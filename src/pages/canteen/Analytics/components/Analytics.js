// src/pages/canteen/Analytics/Analytics.js
import React, { useEffect, useState } from 'react';
import styles from '../../../../styles/Analytics.module.css';
import canteenApi from "../../../../api/canteenApi";
import SalesSection from './sections/SalesSection';
import UsersSection from './sections/UsersSection';
import ProductsSection from './sections/ProductsSection';
import ReviewsSection from './sections/ReviewsSection';
import Tabs from './Common/Tabs';
import DateRangePicker from './Common/DateRangePicker';
import { useSelector } from 'react-redux';

const Analytics = () => {

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  

  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(new Date()));
  const [activeTab, setActiveTab] = useState('sales');
  const { user } = useSelector((state) => state.auth);

 useEffect(()=>{
    console.log(startDate,endDate);
 },[startDate,endDate])



  // State for all data
  const [salesData, setSalesData] = useState({});
  const [usersData, setUsersData] = useState({});
  const [productsData, setProductsData] = useState({});
  const [reviewsData, setReviewsData] = useState([]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const canteenId = user?.canteen?._id;
      const salesRes = await canteenApi.fetchSalesData(startDate,endDate,canteenId);
      setSalesData(salesRes.data);
  
      const usersRes = await canteenApi.fetchUsersData(startDate,endDate,canteenId);
      setUsersData(usersRes.data);
  
      const productsRes = await canteenApi.fetchProductsData(startDate,endDate,canteenId);
      setProductsData(productsRes.data);
  
      const reviewsRes = await canteenApi.fetchReviewsData(canteenId);
      setReviewsData(reviewsRes.data);
  
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    fetchAllData();
  }, [startDate,endDate, activeTab]);

  const handleRefresh = () => {
    fetchAllData();
  };

  const renderTabContent = () => {
    switch (activeTab) {
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
          <h1 className={styles.heading} onClick={handleRefresh}>Analytics</h1>
          <p className={styles.subheading}>Insights and metrics at a glance</p>
        </div>
        <div className={styles.actions}>
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