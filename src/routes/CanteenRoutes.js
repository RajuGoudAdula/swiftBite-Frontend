import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ManageOrders from '../pages/canteen/OrderManagement';
import Analytics from '../pages/canteen/Analytics/components/Analytics';
import ManageMenu from '../pages/canteen/ManageMenu';
import Dashboard from '../pages/canteen/Dashboard';
import Profile from '../pages/user/Profile';
import ReviewList from '../pages/canteen/CanteenReviewPage';


const CanteenRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="menu" element={<ManageMenu />} />
      <Route path="orders" element={<ManageOrders />} />
      <Route path="profile" element={<Profile />} />
      {/* <Route path="/revenue" element={<Revenue />} /> */}
      <Route path='analytics' element={<Analytics />} /> 
      <Route path='reviews' element={<ReviewList />} />
    </Routes>
  );
};

export default CanteenRoutes;
