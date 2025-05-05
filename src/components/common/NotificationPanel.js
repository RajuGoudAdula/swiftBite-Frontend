import React, { useEffect, useRef } from 'react';
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

import socket, {
  registerUserForNotifications,
  listenForNotifications
} from '../../services/socket';
import { fetchCanteenStatus } from '../../store/slices/authSlice';

const NotificationPanel = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.notifications);
  const user = useSelector(state => state.auth.user);

  const swipeRefs = useRef({}); // track DOM nodes for swipe detection

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
    if (!user?.id) return;

    registerUserForNotifications(user.id, user.role);

    const handler = async (notification) => {
        await dispatch(addNotification(notification));

        if(notification?.refModel === "Canteen"){
           dispatch(fetchCanteenStatus(user?.canteen?._id));
         }
       
    };

    listenForNotifications(handler);

    dispatch(userAllNotifications(user.id));

    return () => {
      socket.off('new_notification', handler);
    };
  }, [user, dispatch]);

  const handleSwipeStart = (e, id) => {
    const touch = e.touches[0];
    swipeRefs.current[id] = { startX: touch.clientX };
  };

  const handleSwipeMove = (e, id) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeRefs.current[id]?.startX;

    const element = document.getElementById(`notif-${id}`);
    if (element && deltaX > 0) {
      element.style.transform = `translateX(${deltaX}px)`;
    }
  };

  const handleSwipeEnd = (e, id) => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - swipeRefs.current[id]?.startX;
  
    const element = document.getElementById(`notif-${id}`);
    if (!element) return;
  
    const threshold = element.offsetWidth / 2; // Half of element width
  
    if (deltaX > threshold) {
      element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      element.style.transform = `translateX(${element.offsetWidth}px)`;
      element.style.opacity = 0;
  
      setTimeout(() => {
        dispatch(removeNotification(id));
      }, 300);
    } else {
      // Reset position
      element.style.transition = 'transform 0.3s ease';
      element.style.transform = 'translateX(0px)';
    }
  };
  

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
            id={`notif-${notification._id}`}
            key={notification._id}
            className={`${styles.listItem} ${styles.swipeable} ${notification.isRead ? styles.read : styles.unread}`}
            onTouchStart={(e) => handleSwipeStart(e, notification._id)}
            onTouchMove={(e) => handleSwipeMove(e, notification._id)}
            onTouchEnd={(e) => handleSwipeEnd(e, notification._id)}
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
