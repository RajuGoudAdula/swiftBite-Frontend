import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Footer.css';

const Footer = () => {
  const { user } = useSelector((state) => state.auth);

  const renderFooter = () => {
    if (user.role === 'user') {
      return (
        <div className="footer-container">
          <Link to="/">Home</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>
      );
    }

    if (user.role === 'canteen') {
      return (
        <div className="footer-container">
          <Link to="/canteen/orders">Orders</Link>
          <Link to="/canteen/menu">Manage Menu</Link>
          <Link to="/canteen/contact-admin">Contact Admin</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>
      );
    }

    if (user.role === 'admin') {
      return (
        <div className="footer-container">
          <Link to="/admin/products">Manage Products</Link>
          <Link to="/admin/canteens">Manage Canteens</Link>
          <Link to="/admin/contact-super-admin">Contact Super Admin</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>
      );
    }
  };

  return (
    <footer className="footer">
      {renderFooter()}
    </footer>
  );
};

export default Footer;