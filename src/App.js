import React, { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { userAllNotifications } from './store/slices/notificationSlice';
import "./App.css";
import usePushNotifications from './hooks/usePushNotifications';

function App() {
    const [showSplash, setShowSplash] = useState(true);
    const {user , isAuthenticated} = useSelector(state => state.auth);
    const dispatch=useDispatch();

    useEffect(()=>{
      if(isAuthenticated){
        dispatch(userAllNotifications(user?.id));
      }
    },[dispatch]);

    
    usePushNotifications(user?.id);

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
                   {/* {showSplash ? (
                        <VideoSplashScreen onFinish={() => setShowSplash(false)} />
                      ) : (
                      <> */}
                         <Navbar />
                         <StudentRoute />
                      {/* </>
                        )} */}
                </PrivateRoute>
              }
            />
          </>
        
      </Routes>
    </Router>
  );
}

export default App;
