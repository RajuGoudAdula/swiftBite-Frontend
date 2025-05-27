import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/user/Home';
import Cart from '../pages/user/Cart';
import UserOrders from '../pages/user/Order';
import Profile from '../pages/user/Profile';
import PaymentStatus from '../pages/user/PaymentStatus';
import EditProfile from '../pages/user/EditProfile';
import ItemDetailPage from '../pages/user/ItemDetailPage';
import FloatingCartButton from '../pages/user/FloatingCartButton';
import PreviousOrder from '../pages/user/PreviousOrders';
import NotificationPanel from '../components/common/NotificationPanel';
import Footer from '../components/common/Footer';
import AboutUs from '../components/common/AboutUs';
import PrivacyPolicy from '../components/common/PrivacyPolicy';
import TermsConditions from '../components/common/TermsConditions';
import StudentContactForm from '../components/user/StudentContactForm';
import CanteenFeedbackForm from '../pages/user/CanteenFeedbackForm';

const StudentRoutes = () => {

  return (
    <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<UserOrders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/item/:itemId" element={<ItemDetailPage />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/previous-orders" element={<PreviousOrder />} />
            <Route path='/notifications' element={<NotificationPanel />} />
            <Route path='/about-us' element={<AboutUs />} />
            <Route path='/privacy' element={<PrivacyPolicy />} />
            <Route path='/terms' element={<TermsConditions />} />
            <Route path='/contact-us' element={<StudentContactForm />} />
            <Route path='/feedback' element={<CanteenFeedbackForm />} />
          </Routes>
          <Footer userType="student"/>
          <FloatingCartButton />
        </>
  );
};

export default StudentRoutes;
