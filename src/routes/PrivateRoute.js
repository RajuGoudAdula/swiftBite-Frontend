import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // ✅ If not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // ✅ If role is unauthorized, redirect to unauthorized
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  // ✅ Render the children (Page like Profile, Cart, etc.)
  return children;
};

export default PrivateRoute;
