import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Unauthorized from './pages/auth/Unauthorized';
import AdminRoutes from './routes/AdminRoutes';
import CanteenRoutes from './routes/CanteenRoutes';
import StudentRoute from './routes/StudentRoute';
import PrivateRoute from './routes/PrivateRoute';
import Navbar from './components/common/Navbar';
import Toast from './components/common/Toast';
import AuthPage from './pages/auth/AuthPage';

function App() {

  return (
    <Router>
      <Toast />
      <Routes>
        {/* Auth routes should always be accessible */}
        <Route path="/login" element={<AuthPage initialMode="login" />} />
        <Route path="/register" element={<AuthPage initialMode="register" />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Block protected routes until auth is checked */}
        
          <>
            <Route
              path="/admin/*"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <Navbar />
                  <AdminRoutes />
                </PrivateRoute>
              }
            />

            <Route
              path="/canteen/*"
              element={
                <PrivateRoute allowedRoles={['canteen']}>
                  <Navbar />
                  <CanteenRoutes />
                </PrivateRoute>
              }
            />

            <Route
              path="/*"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <Navbar />
                  <StudentRoute />
                </PrivateRoute>
              }
            />
          </>
        
      </Routes>
    </Router>
  );
}

export default App;
