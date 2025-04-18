import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Unauthorized from './pages/auth/Unauthorized';
import AdminRoutes from './routes/AdminRoutes';
import CanteenRoutes from './routes/CanteenRoutes';
import StudentRoute from './routes/StudentRoute';
import PrivateRoute from './routes/PrivateRoute';
import Navbar from './components/common/Navbar';
import Toast from './components/common/Toast';
import AuthPage from './pages/auth/AuthPage';
import VideoSplashScreen from './components/common/VideoSplashScreen';

function App() {
    const [showSplash, setShowSplash] = useState(true);

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
                  {showSplash ? (
                        <VideoSplashScreen onFinish={() => setShowSplash(false)} />
                      ) : (
                      <>
                        <Navbar />
                        <AdminRoutes />
                      </>
                  )}
                </PrivateRoute>
              }
            />

            <Route
              path="/canteen/*"
              element={
                <PrivateRoute allowedRoles={['canteen']}>
                  {showSplash ? (
                        <VideoSplashScreen onFinish={() => setShowSplash(false)} />
                      ) : (
                      <>
                        <Navbar />
                        <CanteenRoutes />     
                      </>
                      )}
                </PrivateRoute>
              }
            />

            <Route
              path="/*"
              element={
                <PrivateRoute allowedRoles={['user']}>
                   {showSplash ? (
                        <VideoSplashScreen onFinish={() => setShowSplash(false)} />
                      ) : (
                      <>
                         <Navbar />
                         <StudentRoute />
                      </>
                        )}
                </PrivateRoute>
              }
            />
          </>
        
      </Routes>
    </Router>
  );
}

export default App;
