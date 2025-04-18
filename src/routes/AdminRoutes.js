import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageProducts from '../pages/admin/ManageProducts';
import ManageColleges from '../pages/admin/ManageColleges';
import ManageCanteens from '../pages/admin/ManageCanteens';
import Profile from '../pages/user/Profile';


const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="products" element={<ManageProducts />} />
      <Route path="colleges" element={<ManageColleges />} />
      <Route path="canteens" element={<ManageCanteens />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
  );
};

export default AdminRoutes;
