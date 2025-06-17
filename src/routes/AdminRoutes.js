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
import AdminUserManagement from '../pages/admin/AdminUserManagement';
import AdminFeedbackManager from '../pages/admin/AdminFeedbackManager';
import FloatingHomeButton from '../components/common/FloatingHomeButton';


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
        <Route path='user-management' element={<AdminUserManagement />} />
        <Route path='feedbacks' element={<AdminFeedbackManager />} />
      </Routes>
      <Footer userType="admin"/>
      <FloatingHomeButton />
    </>
  );
};

export default AdminRoutes;
