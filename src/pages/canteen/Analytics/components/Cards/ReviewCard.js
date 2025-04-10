import React from 'react';
import styles from '../../../../../styles/Analytics.module.css';

const ReviewCard = ({ review }) => {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <span className={styles.reviewUser}>{review.user}</span>
        <span className={styles.reviewDate}>
          {new Date(review.date).toLocaleDateString()}
        </span>
      </div>
      <div className={styles.reviewContent}>
        <p className={styles.reviewText}>{review.comment}</p>
      </div>
    </div>
  );
};

export default ReviewCard;