import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import Order from './Order';
import EditProfile from './EditProfile';
import OrderManagement from "../canteen/OrderManagement";
import Analytics from '../canteen/Analytics/components/Analytics';
import styles from "../../styles/Profile.module.css";
import ManageMenu from "../canteen/ManageMenu";
import ManageCanteens from "../admin/ManageCanteens";
import ManageColleges from "../admin/ManageColleges";
import ManageProducts from "../admin/ManageProducts";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const [selectedOption, setSelectedOption] = useState("orders");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const profilePicture = user?.profilePicture?.data
    ? `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(user.profilePicture.data)))}` 
    : null;

  if (!role) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Profile Header */}
      <div className={styles.header}>
        <div className={styles.avatarContainer}>
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className={styles.avatar} />
          ) : (
            <FaUserCircle className={styles.avatarFallback} />
          )}
        </div>
        <div className={styles.userInfo}>
          <h1 className={styles.userName}>{user?.username || "User"}</h1>
          <p className={styles.userEmail}>{user?.email || "No Email"}</p>
        </div>
      </div>

      {/* Mobile View */}
      {isMobile ? (
        <div className={styles.mobileMenu}>
          {role === "admin" && (
            <>
              <button className={styles.menuItem} onClick={() => navigate("/admin/colleges")}>
                Manage Colleges
              </button>
              <button className={styles.menuItem} onClick={() => navigate("/admin/canteens")}>
                Manage Canteens
              </button>
              <button className={styles.menuItem} onClick={() => navigate("/admin/products")}>
                Manage Products
              </button>
            </>
          )}

          {role === "canteen" && (
            <>
              <button className={styles.menuItem} onClick={() => navigate("/canteen/orders")}>
                Manage Orders
              </button>
              <button className={styles.menuItem} onClick={() => navigate("/canteen/menu")}>
                Update Menu
              </button>
              <button className={styles.menuItem} onClick={() => navigate("/canteen/analytics")}>
                Analytics
              </button>
            </>
          )}

          {role === "user" && (
            <>
              <button className={styles.menuItem} onClick={() => navigate("/orders")}>
                My Orders
              </button>
              <button className={styles.menuItem} onClick={() => navigate("/edit-profile")}>
                Edit Profile
              </button>
            </>
          )}

          <button className={styles.signOutButton} onClick={handleSignOut}>
            Log Out
          </button>
        </div>
      ) : (
        <div className={styles.desktopContainer}>
          {/* Desktop Menu */}
          <div className={styles.sidebar}>
            {role === "admin" && (
              <>
                <button 
                  className={`${styles.menuItem} ${selectedOption === "colleges" ? styles.active : ''}`}
                  onClick={() => setSelectedOption("colleges")}
                >
                  Manage Colleges
                </button>
                <button 
                  className={`${styles.menuItem} ${selectedOption === "canteens" ? styles.active : ''}`}
                  onClick={() => setSelectedOption("canteens")}
                >
                  Manage Canteens
                </button>
                <button 
                  className={`${styles.menuItem} ${selectedOption === "products" ? styles.active : ''}`}
                  onClick={() => setSelectedOption("products")}
                >
                  Manage Products
                </button>
              </>
            )}

            {role === "canteen" && (
              <>
                <button 
                  className={`${styles.menuItem} ${selectedOption === "orders" ? styles.active : ''}`}
                  onClick={() => setSelectedOption("orders")}
                >
                  Manage Orders
                </button>
                <button 
                  className={`${styles.menuItem} ${selectedOption === "menu-update" ? styles.active : ''}`}
                  onClick={() => setSelectedOption("menu-update")}
                >
                  Update Menu
                </button>
                <button 
                  className={`${styles.menuItem} ${selectedOption === "analytics" ? styles.active : ''}`}
                  onClick={() => setSelectedOption("analytics")}
                >
                  Analytics
                </button>
              </>
            )}

            {role === "user" && (
              <>
                <button 
                  className={`${styles.menuItem} ${selectedOption === "orders" ? styles.active : ''}`}
                  onClick={() => setSelectedOption("orders")}
                >
                  My Orders
                </button>
                <button 
                  className={`${styles.menuItem} ${selectedOption === "profile" ? styles.active : ''}`}
                  onClick={() => setSelectedOption("profile")}
                >
                  Edit Profile
                </button>
              </>
            )}

            <button className={styles.signOutButton} onClick={handleSignOut}>
              Sign Out
            </button>
          </div>

          {/* Dynamic Content */}
          <div className={styles.content}>
            {role === "admin" && (
              <>
                {selectedOption === "canteens" && <ManageCanteens />}
                {selectedOption === "colleges" && <ManageColleges />}
                {selectedOption === "products" && <ManageProducts />}
              </>
            )}

            {role === "canteen" && (
              <>
                {selectedOption === "orders" && <OrderManagement />}
                {selectedOption === "menu-update" && <ManageMenu />}
                {selectedOption === "analytics" && <Analytics />}
              </>
            )}

            {role === "user" && (
              <>
                {selectedOption === "profile" && <EditProfile userDetails={user} />}
                {selectedOption === "orders" && <Order userId={user?.id} />}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;