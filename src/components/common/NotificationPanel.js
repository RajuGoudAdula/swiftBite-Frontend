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

import socket, {
  registerUserForNotifications,
  listenForNotifications
} from '../../services/socket';
import { fetchCanteenStatus } from '../../store/slices/authSlice';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const NotificationItem = ({ notification, onRemove, onMarkRead }) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

  return (
    <motion.li
      className={`${styles.listItem} ${notification.isRead ? styles.read : styles.unread}`}
      style={{ x, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(event, info) => {
        if (info.offset.x > 120 || info.velocity.x > 700) {
          animate(x, 500, {
            type: 'tween',
            duration: 0.2,
            onComplete: () => onRemove(notification._id),
          });
        } else {
          animate(x, 0, { type: 'spring', stiffness: 300 });
        }
      }}
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
          <button onClick={() => onRemove(notification._id)} className={styles.deleteBtn}>
            <FaTimes size={14} />
          </button>
        </div>
        <div className={styles.bottomSection}>
          <p className={styles.timestamp}>{formatNotificationTime(notification.createdAt)}</p>
          <div className={styles.actions}>
            {!notification.isRead && (
              <button onClick={() => onMarkRead(notification._id)} className={styles.actionBtn}>
                Mark as Read
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.li>
  );
};

const NotificationPanel = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.notifications);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (!user?.id) return;

    registerUserForNotifications(user.id, user.role);

    const handler = async (notification) => {
      await dispatch(addNotification(notification));

      if (notification?.refModel === "Canteen") {
        dispatch(fetchCanteenStatus(user?.canteen?._id));
      }
    };

    listenForNotifications(handler);
    dispatch(userAllNotifications(user.id));

    return () => {
      socket.off('new_notification', handler);
    };
  }, [user, dispatch]);

  const handleRemove = (id) => {
    dispatch(removeNotification(id));
  };

  const handleMarkRead = (id) => {
    dispatch(markNotificationAsRead(id));
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
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            onRemove={handleRemove}
            onMarkRead={handleMarkRead}
          />
        ))}
      </ul>
    </div>
  );
};

// Move this function outside to avoid recreating on every render
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

export default NotificationPanel;
