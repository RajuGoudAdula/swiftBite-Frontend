import React, { useState } from 'react';
import StarRating from '../Utility/StarRating';
import ResponseForm from '../Utility/ResponseForm';
import styles from '../../../../../styles/Analytics.module.css';
import canteenApi from '../../../../../api/canteenApi';
import { useSelector } from 'react-redux';

const ReviewsTable = ({ data, loading }) => {
  const [editingResponse, setEditingResponse] = useState(null);
  const [responseText, setResponseText] = useState('');
  const { user } = useSelector((state) => state.auth);

  const handleResponseSubmit = async (reviewId,response,orderId) => {
    try {
      const canteenId = user?.canteen?._id;
      await canteenApi.submitReviewResponse(canteenId , reviewId, response,orderId);
      await canteenApi.fetchReviewsData(canteenId);
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
              <td>#{review?.orderId?._id}</td>
              <td>{review.product}</td>
              <td>{review.user}</td>
              <td>
                <StarRating rating={review.rating} />
              </td>
              <td>{review.review}</td>
              <td>{new Date(review.createdAt).toLocaleDateString()}</td>
              <td>
                {review.canteenResponse.text ? (
                  review.canteenResponse.text
                ) : editingResponse === review._id ? (
                  <ResponseForm
                    reviewId={review._id}
                    orderId={review.orderId?._id}
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