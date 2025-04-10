import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaShoppingCart, 
  FaBell, 
  FaUserCircle, 
  FaSearch, 
  FaTimes,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { useSelector } from "react-redux";
import userApi from "../../api/userApi";
import debounce from 'lodash.debounce';
import styles from "../../styles/Navbar.module.css";

const Navbar = () => {
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
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
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
            SwiftBite
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
                <FaSearch />
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
          <div className={styles.mobileSearchIcon}>
            <FaSearch 
              size={20} 
              onClick={() => setSearchOpen(!searchOpen)} 
              className={styles.icon}
              aria-label="Search"
            />
          </div>
          
          {/* Notifications */}
          <div ref={notificationsRef} className={styles.notificationContainer}>
            <button 
              className={styles.iconButton}
              onClick={toggleNotifications}
              aria-label="Notifications"
            >
              <FaBell size={20} />
              <span className={styles.notificationBadge}>3</span>
            </button>
            {notificationsOpen && (
              <div className={styles.notificationDropdown}>
                <div className={styles.dropdownHeader}>Notifications</div>
                <div className={styles.notificationItem}>
                  <div className={styles.notificationTitle}>Order Confirmed</div>
                  <div className={styles.notificationTime}>2 mins ago</div>
                </div>
                <div className={styles.notificationItem}>
                  <div className={styles.notificationTitle}>Special Offer</div>
                  <div className={styles.notificationTime}>1 hour ago</div>
                </div>
                <Link 
                  to="/notifications" 
                  className={styles.viewAll}
                  onClick={() => setNotificationsOpen(false)}
                >
                  View All Notifications
                </Link>
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
              <FaUserCircle size={24} />
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
              <FaShoppingCart size={20} />
              <span className={styles.cartBadge}>2</span>
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