import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import styles from '../../styles/Footer.module.css';
import { Link } from 'react-router-dom';

const Footer = ({ userType }) => {
  // Conditional rendering based on user type
  const renderStudentFooter = () => (
    <>
      <div className={styles.column}>
        <ul className={styles.links}>
          <li className={styles.li}><Link to="/about-us" className={styles.link}>About Us</Link></li>
          <li className={styles.li}><Link to="/terms" className={styles.link}>Terms & Conditions</Link></li>
          <li className={styles.li}><Link to="/privacy" className={styles.link}>Privacy Policy</Link></li>
          <li className={styles.li}><Link to="/contact-us" className={styles.link}>Contact Us</Link></li>
          <li className={styles.li}><Link to="/feedback" className={styles.link}>Give Feedback</Link></li>
        </ul>
      </div>
      <div className={styles.column}>
       <h4 className={styles.heading}>SwiftBite</h4>
        <div className={styles.socialIcons}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.icon}><FaFacebook /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.icon}><FaInstagram /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.icon}><FaTwitter /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.icon}><FaLinkedin /></a>
        </div>
        <p className={styles.rights}>&copy; {new Date().getFullYear()} SwiftBite. All rights reserved.</p>
      </div>
    </>
  );

  const renderCanteenOwnerFooter = () => (
    <>
      <div className={styles.column}>
      <h4 className={styles.heading}>Canteen Panel</h4>
        <ul className={styles.links}>
        <li className={styles.li}><Link to="/canteen/dashboard" className={styles.link}>Dashboard</Link></li>
        <li className={styles.li}><Link to="/canteen/menu" className={styles.link}>Menu Management</Link></li>
        <li className={styles.li}><Link to="/canteen/orders" className={styles.link}>Order History</Link></li>
        <li className={styles.li}><Link to="/canteen/feedback" className={styles.link}>Student Feedback</Link></li>
        </ul>
      </div>
      <div className={styles.column}>
      <h4 className={styles.heading}>SwiftBite</h4>
        <div className={styles.socialIcons}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.icon}><FaFacebook /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.icon}><FaInstagram /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.icon}><FaTwitter /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.icon}><FaLinkedin /></a>
        </div>
        <p className={styles.rights}>&copy; {new Date().getFullYear()} SwiftBite. All rights reserved.</p>
      </div>
    </>
  );

  const renderAdminFooter = () => (
    <>
      <div className={styles.column}>
        <h4 className={styles.heading}>Admin Panel</h4>
        <ul className={styles.links}>
        <li className={styles.li}><Link to="/admin/dashboard" className={styles.link}>Dashboard</Link></li>
        <li className={styles.li}><Link to="/admin/user-management" className={styles.link}>User Management</Link></li>
        <li className={styles.li}><Link to="/admin/canteens" className={styles.link}>Canteen Management</Link></li>
        </ul>
      </div>
      <div className={styles.column}>
      <h4 className={styles.heading}>SwiftBite</h4>
        <div className={styles.socialIcons}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.icon}><FaFacebook /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.icon}><FaInstagram /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.icon}><FaTwitter /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.icon}><FaLinkedin /></a>
        </div>
        <p className={styles.rights}>&copy; {new Date().getFullYear()} SwiftBite. All rights reserved.</p>
      </div>
    </>
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {userType === 'student' && renderStudentFooter()}
        {userType === 'canteen' && renderCanteenOwnerFooter()}
        {userType === 'admin' && renderAdminFooter()}
      </div>
    </footer>
  );
};

export default Footer;
