import React, { useEffect, useState } from 'react';
import styles from '../../styles/CanteenFeedbackViewer.module.css';
import canteenApi from '../../api/canteenApi';
import { useSelector } from 'react-redux';

const CanteenFeedbackViewer = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const { user } = useSelector((state) => state.auth || {});

  useEffect(() => {
    fetchCanteenFeedbacks();
  }, []);

  const fetchCanteenFeedbacks = async () => {
    try {
      const canteenId = user?.canteen?._id;
      const res = await canteenApi.getCanteenFeedbacks(canteenId);
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Error fetching canteen feedbacks:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Canteen Feedback</h2>

      {feedbacks.length === 0 ? (
          <p className={styles.empty}>No feedback received yet.</p>
        ) : (
          <div className={styles.grid}>
            {feedbacks.map((fb) => (
              <div key={fb._id} className={styles.card}>
                <div className={styles.info}>
                  <p className={styles.infoItem}><strong className={styles.label}>User:</strong> {fb.userName} ({fb.email})</p>
                  <p className={styles.infoItem}><strong className={styles.label}>Subject:</strong> {fb.subject}</p>
                  <p className={styles.infoItem}><strong className={styles.label}>Message:</strong> {fb.message}</p>
                </div>
                <div className={styles.previous}>
                  <p className={styles.responseItem}><strong className={styles.label}>User Response:</strong> {fb?.userResponseAdmin || '—'}</p>
                  <p className={styles.responseItem}><strong className={styles.label}>Canteen Admin Response:</strong> {fb?.canteenResponseAdmin || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

    </div>
  );
};

export default CanteenFeedbackViewer;
