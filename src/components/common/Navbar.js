import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {  
  FaTimes,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { useSelector } from "react-redux";
import userApi from "../../api/userApi";
import debounce from 'lodash.debounce';
import styles from "../../styles/Navbar.module.css";
import logo from "../../logo.png";

const Navbar = () => {
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const notifications = useSelector(state => state.notifications.notifications);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popularItems, setPopularItems] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const [newNotifications,setNewNotifications] = useState(notifications?.filter(e => e.isRead === false) || []);


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    const newNotify = notifications.filter(e => !e.isRead).reverse();
    setNewNotifications(newNotify.length ? newNotify : notifications);
  }, [notifications]);
  
  // Fetch popular items
  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const response = await userApi.fetchPopularItems();
        setPopularItems(response.data);
      } catch (error) {
        console.error("Error fetching popular items:", error);
      }
    };
    fetchPopularItems();
  }, []);

  // Debounced search
  // Update your debouncedSearch function:
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.trim() === "") {
        setSearchResults([]);
        setLoading(false);
        setSearchError(null);
        return;
      }
      try {
        setLoading(true);
        setSearchError(null);
        const response = await userApi.debouncedSearch(query);
        const results = response.data.data || response.data;
        if (!Array.isArray(results)) {
          throw new Error("Invalid data format received from server");
        }
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
        setSearchError(error.message);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setLoading(true);
      debouncedSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, debouncedSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // if (searchQuery.trim()) {
    //   navigate(`/search?q=${searchQuery}`);
    //   setSearchOpen(false);
    //   setSearchQuery("");
    // }
  };

  const handleItemClick = (item) => {
    navigate(`/item/${item._id}`);
    setSearchQuery("");
    setSearchOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setDropdownOpen(false);
  };

  const NoOfNotifications = () => {
    const count = notifications?.filter(e => e.isRead === false);
    return count.length;
  }

  function formatNotificationTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
  
    const isSameDay = (a, b) =>
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();
  
    if (isSameDay(date, now)) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isSameDay(date, yesterday)) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    }
  }
  
  
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link
            to={
              user?.role === "canteen"
                ? "/canteen/dashboard"
                : user?.role === "admin"
                ? "/admin/dashboard"
                : "/"
            }
            className={styles.logoText}
          >
             {logo ? (
                <img src={logo} alt="SwiftBite Logo" className={styles.logoImage} />
              ) : (
                <>SwiftBite</>
              )}
          </Link>
        </div>

        {/* Desktop Search */}
        <div className={styles.desktopSearchContainer} ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder="Search for food, drinks..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className={styles.clearButton}
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}
              <button 
                type="submit" 
                className={styles.searchButton}
                aria-label="Search"
              >
                <svg height="48" viewBox="0 0 17 48" width="17" xmlns="http://www.w3.org/2000/svg"><path d="m16.2294 29.9556-4.1755-4.0821a6.4711 6.4711 0 1 0 -1.2839 1.2625l4.2005 4.1066a.9.9 0 1 0 1.2588-1.287zm-14.5294-8.0017a5.2455 5.2455 0 1 1 5.2455 5.2527 5.2549 5.2549 0 0 1 -5.2455-5.2527z"></path></svg>
              </button>
            </div>
            
            {showSuggestions && (
                <div className={styles.searchDropdown}>
                  {loading ? (
                    <div className={styles.dropdownItem}>
                      <div className={styles.searchLoading}>
                        <div className={styles.spinner}></div>
                        Searching...
                      </div>
                    </div>
                  ) : searchError ? (
                    <div className={styles.dropdownItem}>
                      <div className={styles.searchError}>
                        Error loading results. Please try again.
                      </div>
                    </div>
                  ) : searchQuery && searchResults.length === 0 ? (
                    <div className={styles.dropdownItem}>
                      <div className={styles.noResults}>
                        No results found for "{searchQuery}"
                      </div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <div className={styles.dropdownHeader}>Search Results</div>
                      {searchResults.map((item) => {
                        const image = item.image || "/default-food.png";
                        const name = item.name || "Unnamed Item";
                       
                        return (
                          <div
                            key={item._id || Math.random().toString(36).substr(2, 9)}
                            className={styles.dropdownItem}
                            onClick={() => handleItemClick(item)}
                          >
                            <div className={styles.searchItemInfo}>
                              <img
                                src={image}
                                alt={name}
                                className={styles.searchItemImage}
                                onError={(e) => {
                                  e.target.src = "/default-food.png";
                                }}
                              />
                              <div className={styles.searchItemName}>{name}</div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <div className={styles.dropdownHeader}>Popular Items</div>
                      {Array.isArray(popularItems) && popularItems.length > 0 ? (
                        popularItems.map((item) => {
                          const image = item.image || "/default-food.png";
                          const name = item.name || "Unnamed Item";
                         
                          return (
                            <div
                              key={item._id || Math.random().toString(36).substr(2, 9)}
                              className={styles.dropdownItem}
                              onClick={() => handleItemClick(item)}
                            >
                              <div className={styles.searchItemInfo}>
                                <img
                                  src={image}
                                  alt={name}
                                  className={styles.searchItemImage}
                                  onError={(e) => {
                                    e.target.src = "/default-food.png";
                                  }}
                                />
                                <div className={styles.searchItemName}>{name}</div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className={styles.dropdownItem}>
                          <div className={styles.noResults}>No popular items available</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

          </form>
        </div>

        <div className={styles.navIcons}>
          {/* Mobile Search Toggle */}
          <div className={styles.mobileSearchIcon} onClick={() => setSearchOpen(!searchOpen)} >
          <svg height="48" viewBox="0 0 17 48" width="17" xmlns="http://www.w3.org/2000/svg"><path d="m16.2294 29.9556-4.1755-4.0821a6.4711 6.4711 0 1 0 -1.2839 1.2625l4.2005 4.1066a.9.9 0 1 0 1.2588-1.287zm-14.5294-8.0017a5.2455 5.2455 0 1 1 5.2455 5.2527 5.2549 5.2549 0 0 1 -5.2455-5.2527z"></path></svg>
          </div>
          
          {/* Notifications */}
          <div ref={notificationsRef} className={styles.notificationContainer}>
            <button 
              className={styles.iconButton}
              onClick={toggleNotifications}
              aria-label="Notifications"
            >
             
                <svg
                  className={styles.svg}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                  height="48"
                  width="17"
                  style={{width:"25px"}}
                >
                  <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              {NoOfNotifications()>0 && <span className={styles.notificationBadge}>{NoOfNotifications()}</span>}
            </button>
            {notificationsOpen && (
              <div className={styles.notificationDropdown}>
                <div className={styles.dropdownHeader}>Notifications</div>
                {newNotifications?.slice(0,3)?.map((notification) => {
                  return (
                    <div className={styles.notificationItem} key={notification._id}>
                      <div className={styles.notificationTitle}>{notification.title}</div>
                      <div className={styles.notificationTime}>{formatNotificationTime(notification.createdAt)}</div>
                    </div>
                  );
                })}

                {user && (
                  <Link 
                    to={`/${user?.role === "user" ? "" : user?.role+"/"}notifications`} 
                    className={styles.viewAll}
                    onClick={() => setNotificationsOpen(false)}
                  >
                    View All Notifications
                  </Link>
                )}

              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div ref={dropdownRef} className={styles.profileContainer}>
            <button 
              className={styles.profileButton}
              onClick={toggleDropdown}
              aria-label="Profile menu"
            >
               
                <svg
                  className={styles.svg}
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                  height="48"
                  width="17"
                >
                  <circle
                    cx="32"
                    cy="22"
                    r="10"
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M16 48C16 40.27 22.27 34 30 34H34C41.73 34 48 40.27 48 48"
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              <span className={styles.profileName}>
                {user?.username || 'Profile'}
              </span>
              {dropdownOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
            </button>
            
            {dropdownOpen && (
              <div className={styles.profileDropdown}>
                <div className={styles.dropdownItem}>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>{user?.username}</div>
                    <div className={styles.userEmail}>{user?.email}</div>
                  </div>
                </div>
                {/* <div className={styles.dropdownDivider}></div> */}
                
                {user?.role === "user" && (
                  <Link 
                    to="/profile" 
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                )}
                {user?.role === "canteen" && (
                  <Link 
                    to="/canteen/profile" 
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Canteen Profile
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link 
                    to="/admin/profile" 
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Admin Profile
                  </Link>
                )}
                {/* <div className={styles.dropdownDivider}></div> */}
                <button 
                  className={styles.logOutButton}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Cart */}
          {user?.role === "user" && (
            <Link to="/cart" className={styles.cartIcon}>
              <svg height="48" viewBox="0 0 17 48" width="17" xmlns="http://www.w3.org/2000/svg">
              <path d="m13.4575 16.9268h-1.1353a3.8394 3.8394 0 0 0 -7.6444 0h-1.1353a2.6032 2.6032 0 0 0 -2.6 2.6v8.9232a2.6032 2.6032 0 0 0 2.6 2.6h9.915a2.6032 2.6032 0 0 0 2.6-2.6v-8.9231a2.6032 2.6032 0 0 0 -2.6-2.6001zm-4.9575-2.2768a2.658 2.658 0 0 1 2.6221 2.2764h-5.2442a2.658 2.658 0 0 1 2.6221-2.2764zm6.3574 13.8a1.4014 1.4014 0 0 1 -1.4 1.4h-9.9149a1.4014 1.4014 0 0 1 -1.4-1.4v-8.9231a1.4014 1.4014 0 0 1 1.4-1.4h9.915a1.4014 1.4014 0 0 1 1.4 1.4z"></path></svg>
              {cartItems.length>0 &&(
                <span className={styles.cartBadge}>{cartItems.length}</span>
              )}
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {searchOpen && (
          <div className={styles.mobileSearchOverlay}>
            <div className={styles.mobileSearchHeader}>
              <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                <div className={styles.searchWrapper}>
                  <button 
                    type="button" 
                    className={styles.backButton}
                    onClick={() => setSearchOpen(false)}
                    aria-label="Close search"
                  >
                    &larr;
                  </button>
                  <input
                    type="text"
                    placeholder="Search for food, drinks..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <button 
                      type="button" 
                      className={styles.clearButton}
                      onClick={clearSearch}
                      aria-label="Clear search"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className={styles.mobileSearchResults}>
              {loading ? (
                <div className={styles.loading}>Searching...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map(item => (
                  <div 
                    key={item._id}
                    role="button"
                    tabIndex={0}
                    className={styles.searchResultItem}
                    onClick={() => handleItemClick(item)}
                    onTouchStart={() => handleItemClick(item)} // Add this line
                    style={{ pointerEvents: 'auto', zIndex: 9999 }} // Just for debugging
                  >
                    <img 
                      src={item.image || '/default-food.png'} 
                      alt={item.name}
                      className={styles.searchItemImage}
                    />
                    <div className={styles.searchItemName}>{item.name}</div>
                  </div>

                ))
              ) : searchQuery ? (
                <div className={styles.noResults}>
                  No results found for "{searchQuery}"
                </div>
              ) : (
                <>
                  <div className={styles.sectionTitle}>Popular Items</div>
                  {Array.isArray(popularItems) && popularItems.map(item => (
                    <div 
                      key={item._id}
                      className={styles.searchResultItem}
                      onClick={() => handleItemClick(item)}
                    >
                      <img 
                        src={item.images?.[0] || '/default-food.png'} 
                        alt={item.name}
                        className={styles.searchItemImage}
                        onError={(e) => {
                          e.target.src = '/default-food.png';
                        }}
                      />
                      <div className={styles.searchItemDetails}>
                        <div className={styles.searchItemName}>{item.name}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

    </>
  );
};

export default Navbar;