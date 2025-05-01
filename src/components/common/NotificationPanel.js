import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addNotification,
  markNotificationAsRead,
  removeNotification,
  clearNotifications,
  userAllNotifications
} from '../../store/slices/notificationSlice';
import { FaBell, FaTimes } from 'react-icons/fa';
import styles from '../../styles/NotificationPanel.module.css';

import {
  registerUserForNotifications,
  listenForNotifications
} from '../../services/socket'; // adjust path if needed

const NotificationPanel = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.notifications);
  const user = useSelector(state => state.auth.user); // adjust path if your auth slice differs

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

  useEffect(() => {
    if (user?.id) {
      registerUserForNotifications(user.id,user.role);
      listenForNotifications((notification) => {
        dispatch(addNotification(notification));
      });
      dispatch(userAllNotifications(user?.id));
    }
  }, [user, dispatch]);

  useEffect(()=>{
    console.log(notifications);
  },[notifications]);

  if (notifications.length === 0) {
    return <div className={styles.empty}>No notifications</div>;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.mainTitle}>Notifications</h2>
        <button onClick={() => dispatch(clearNotifications(user?.id))} className={styles.clearBtn}>
          Clear All
        </button>
      </div>
      <ul className={styles.allItems}>
        {notifications.map((notification, index) => (
          <li
            key={index}
            className={`${styles.listItem} ${notification.isRead ? styles.read : styles.unread}`}
          >
            <div className={styles.icon}>
                <FaBell size={30} />
            </div>
            <div className={styles.flex}>
                <div className={styles.topSection}>
                    <div className={styles.innerTopSection}>
                        <p className={styles.title}>{notification.title}</p>
                        <p className={styles.message}>{notification.message}</p>
                    </div>
                  <button
                    onClick={() => dispatch(removeNotification(notification?._id))}
                    className={styles.deleteBtn}
                    >
                        <FaTimes size={14} />
                  </button>
                </div>
                <div className={styles.bottomSection}>
                    <p className={styles.timestamp}>{formatNotificationTime(notification.createdAt)}</p>
                    <div className={styles.actions}>
                        
                    {!notification.isRead && (
                        <button
                        onClick={() => dispatch(markNotificationAsRead(notification?._id))}
                        className={styles.actionBtn}
                        >
                        Mark as Read
                        </button>
                    )}
                    
                    </div>
                </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPanel;
