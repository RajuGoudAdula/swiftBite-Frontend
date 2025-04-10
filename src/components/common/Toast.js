import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast, pauseToast, resumeToast } from '../../store/slices/toastSlice';
import styles from '../../styles/Toast.module.css';

const Toast = () => {
  const toasts = useSelector((state) => state.toast);
  const dispatch = useDispatch();
  const toastRefs = useRef({});

  // Toast types configuration
  const toastConfig = {
    success: {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
      ),
      color: '#4CAF50'
    },
    error: {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
        </svg>
      ),
      color: '#F44336'
    },
    warning: {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L1 21h22L12 2zm0 3.5L18.5 19h-13L12 5.5zM12 15c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1z"/>
        </svg>
      ),
      color: '#FF9800'
    },
    info: {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z"/>
        </svg>
      ),
      color: '#2196F3'
    }
  };

  // Handle toast dismissal
  useEffect(() => {
    const currentRefs = toastRefs.current;
    
    return () => {
      // Clean up any remaining timeouts
      Object.values(currentRefs).forEach(ref => {
        if (ref?.timeoutId) clearTimeout(ref.timeoutId);
      });
    };
  }, []);

  // Handle toast auto-dismissal
  const setupAutoDismiss = (toast) => {
    if (toastRefs.current[toast.id]?.timeoutId) {
      clearTimeout(toastRefs.current[toast.id].timeoutId);
    }

    toastRefs.current[toast.id] = {
      timeoutId: setTimeout(() => {
        dispatch(removeToast(toast.id));
        delete toastRefs.current[toast.id];
      }, toast.duration || 3000)
    };
  };

  // Pause toast dismissal
  const pauseDismissal = (toastId) => {
    if (toastRefs.current[toastId]?.timeoutId) {
      clearTimeout(toastRefs.current[toastId].timeoutId);
      dispatch(pauseToast(toastId));
    }
  };

  // Resume toast dismissal
  const resumeDismissal = (toast) => {
    if (!toast.isPaused) return;
    setupAutoDismiss(toast);
    dispatch(resumeToast(toast.id));
  };

  // Close toast manually
  const handleClose = (id) => {
    if (toastRefs.current[id]?.timeoutId) {
      clearTimeout(toastRefs.current[id].timeoutId);
    }
    dispatch(removeToast(id));
    delete toastRefs.current[id];
  };

  // Set up auto-dismissal for new toasts
  useEffect(() => {
    toasts.forEach(toast => {
      if (!toast.isPaused && !toastRefs.current[toast.id]?.timeoutId) {
        setupAutoDismiss(toast);
      }
    });
  }, [toasts, dispatch]);

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => {
        const config = toastConfig[toast.type] || toastConfig.info;
        
        return (
          <div 
            key={toast.id}
            className={`${styles.toast} ${styles[toast.type]}`}
            onMouseEnter={() => pauseDismissal(toast.id)}
            onMouseLeave={() => resumeDismissal(toast)}
            style={{ '--toast-color': config.color }}
            role="alert"
            aria-live="polite"
          >
            <div className={styles.toastContent}>
              <div className={styles.toastIcon}>
                {config.icon}
              </div>
              <div className={styles.toastMessage}>
                {typeof toast.message === 'string' 
                  ? toast.message 
                  : JSON.stringify(toast.message)}
              </div>
              <button
                className={styles.closeButton}
                onClick={() => handleClose(toast.id)}
                aria-label="Close notification"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                </svg>
              </button>
            </div>
            <div 
              className={styles.progressBar}
              style={{
                animationDuration: `${toast.duration || 3000}ms`,
                animationPlayState: toast.isPaused ? 'paused' : 'running',
                backgroundColor: config.color
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Toast;