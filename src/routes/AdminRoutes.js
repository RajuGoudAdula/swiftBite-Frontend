import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageProducts from '../pages/admin/ManageProducts';
import ManageColleges from '../pages/admin/ManageColleges';
import ManageCanteens from '../pages/admin/ManageCanteens';
import Profile from '../pages/user/Profile';
import NotificationPanel from '../components/common/NotificationPanel';
import Footer from '../components/common/Footer';
import ManageHeroSection from '../pages/admin/ManageHeroSection';
import TodaysOrders from '../pages/admin/TodaysOrders';


const AdminRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="colleges" element={<ManageColleges />} />
        <Route path="canteens" element={<ManageCanteens />} />
        <Route path="profile" element={<Profile />} />
        <Route path='notifications' element={<NotificationPanel />} />
        <Route path='offers' element={<ManageHeroSection />} />
        <Route path='orders' element={<TodaysOrders />} />
      </Routes>
      <Footer userType="admin"/>
    </>
  );
};

export default AdminRoutes;
