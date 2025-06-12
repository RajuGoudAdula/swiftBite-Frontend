import React from 'react';
import { FaBell, FaBellSlash } from 'react-icons/fa';
import usePushNotifications from '../../hooks/usePushNotifications';

const NotificationToggle = ({ userId }) => {
  const { isSubscribed, toggleSubscription } = usePushNotifications(userId);

  return (
    <>
      <div className="notification-toggle">
        <label className="switch">
          <input
            type="checkbox"
            checked={isSubscribed}
            onChange={toggleSubscription}
          />
          <span className="slider">
            <span className="icon">
              {isSubscribed ? <FaBell size={12} /> : <FaBellSlash size={12} />}
            </span>
          </span>
        </label>
      </div>

      <style>{`
        .notification-toggle {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 52px;
          height: 28px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #d1d1d6;
          border-radius: 34px;
          transition: background-color 0.3s ease;
          display: flex;
          align-items: center;
          padding: 0 4px;
          font-size: 16px;
        }

        .slider .icon {
          width: 22px;
          height: 22px;
          background-color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: transform 0.3s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          color: #333;
        }

        input:checked + .slider {
          background-color: #34c759;
        }

        input:checked + .slider .icon {
          transform: translateX(24px);
        }

        input:not(:checked) + .slider .icon {
          transform: translateX(0px);
        }
      `}</style>
    </>
  );
};

export default NotificationToggle;
