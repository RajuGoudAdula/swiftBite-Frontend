import React, { useState } from 'react';
import StarRating from '../Utility/StarRating';
import ResponseForm from '../Utility/ResponseForm';
import styles from '../../../../../styles/Analytics.module.css';
import canteenApi from '../../../../../api/canteenApi';

const ReviewsTable = ({ data, loading, setReviewsData }) => {
  const [editingResponse, setEditingResponse] = useState(null);
  const [responseText, setResponseText] = useState('');

  const handleResponseSubmit = async (reviewId) => {
    try {
      await canteenApi.submitReviewResponse(reviewId, responseText);
      const reviewsRes = await canteenApi.fetchReviewsData();
      setReviewsData(reviewsRes.data);
      setEditingResponse(null);
      setResponseText('');
    } catch (err) {
      console.error('Error submitting response:', err);
    }
  };

  if (loading) {
    return <div className={`${styles.skeleton} ${styles.chartSkeleton}`} />;
  }

  return (
    <div className={styles.reviewsTableContainer}>
      <table className={styles.reviewsTable}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>User</th>
            <th>Rating</th>
            <th>Review</th>
            <th>Date</th>
            <th>Canteen Response</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((review) => (
            <tr key={review._id}>
              <td>#{review.orderId}</td>
              <td>{review.productName}</td>
              <td>{review.userName}</td>
              <td>
                <StarRating rating={review.rating} />
              </td>
              <td>{review.comment}</td>
              <td>{new Date(review.createdAt).toLocaleDateString()}</td>
              <td>
                {review.response ? (
                  review.response
                ) : editingResponse === review._id ? (
                  <ResponseForm
                    reviewId={review._id}
                    onSubmit={handleResponseSubmit}
                    onCancel={() => {
                      setEditingResponse(null);
                      setResponseText('');
                    }}
                    initialValue={responseText}
                  />
                ) : (
                  <button
                    onClick={() => {
                      setEditingResponse(review._id);
                      setResponseText('');
                    }}
                    className={styles.respondButton}
                  >
                    Respond
                  </button>
                )}
              </td>
              <td>
                {/* Additional actions if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsTable;