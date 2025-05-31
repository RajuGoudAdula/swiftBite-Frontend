import React, { useEffect, useState } from 'react';
import StarRating from '../Utility/StarRating';
import styles from '../../../../../styles/Analytics.module.css';
import canteenApi from '../../../../../api/canteenApi';
import { useSelector, useDispatch } from 'react-redux';
import ModalPopup from '../../../../../components/common/ModalPopup';
import { addToast } from '../../../../../store/slices/toastSlice';

const ReviewsTable = ({ data, loading, onRefresh }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(''); // "respond", "edit", "delete"
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [reviews, setReviews] = useState(data || []);

  // Sync local reviews when parent data changes
  useEffect(() => {
    setReviews(data || []);
  }, [data]);

  const openModal = (mode, review) => {
    setModalMode(mode);
    setSelectedReview(review);
    setResponseText(review?.canteenResponse?.text || '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setResponseText('');
    setSelectedReview(null);
    setModalMode('');
  };

  const showToast = (type, message) => {
    dispatch(
      addToast({
        id: Date.now(),
        type,
        message,
        duration: 3000,
      })
    );
  };

  const handleResponseSubmit = async () => {
    try {
      const canteenId = user?.canteen?._id;
      const response = await canteenApi.submitReviewResponse(
        canteenId,
        selectedReview?._id,
        responseText,
        selectedReview?.orderId?._id
      );

      showToast('success', modalMode === 'respond' ? 'Response submitted successfully' : 'Response updated successfully');

      // Update the review in local state to reflect the new response without refetching all data
      setReviews((prev) =>
        prev.map((review) =>
          review._id === selectedReview._id
            ? { ...review, canteenResponse: { text: responseText } }
            : review
        )
      );

      onRefresh?.(); // Optional: refresh from parent if needed

      closeModal();
    } catch (err) {
      showToast('error', err?.response?.data?.message || 'Failed to submit response');
      console.error('Error submitting response:', err);
    }
  };

  const handleDeleteResponse = async () => {
    try {
      const canteenId = user?.canteen?._id;
      const userId = user?.id;
      console.log(selectedReview);
      const productId = selectedReview?.productId;
      const orderId = selectedReview?.orderId?._id;
      const response = await canteenApi.deleteReviewResponse(canteenId, selectedReview._id,userId,productId,orderId);

      showToast('success', response?.message || 'Response deleted successfully');

      // Update the review in local state - remove the canteenResponse from the deleted review
      setReviews((prev) =>
        prev.map((review) =>
          review._id === selectedReview._id ? { ...review, canteenResponse: null } : review
        )
      );

      onRefresh?.(); // Optional: refresh from parent if needed

      closeModal();
    } catch (err) {
      showToast('error', err?.response?.data?.message || 'Failed to delete response');
      console.error('Error deleting response:', err);
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
          {reviews?.map((review) => (
            <tr key={review._id}>
              <td>#{review.orderId?._id}</td>
              <td>{review.product}</td>
              <td>{review.user}</td>
              <td><StarRating rating={review.rating} /></td>
              <td>{review.review}</td>
              <td>{new Date(review.createdAt).toLocaleDateString()}</td>
              <td>{review.canteenResponse?.text || 'No response'}</td>
              <td>
                {review.canteenResponse?.text ? (
                  <div className={styles.actionDiv}>
                    <button
                      className={styles.respondButton}
                      onClick={() => openModal('edit', review)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => openModal('delete', review)}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <button
                    className={styles.respondButton}
                    onClick={() => openModal('respond', review)}
                  >
                    Respond
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Respond / Edit / Delete */}
      <ModalPopup
        isOpen={modalOpen}
        title={
          modalMode === 'respond'
            ? 'Respond to Review'
            : modalMode === 'edit'
            ? 'Edit Response'
            : 'Delete Response'
        }
        onClose={closeModal}
        buttons={
          modalMode === 'delete'
            ? [
                {
                  label: 'Delete',
                  onClick: handleDeleteResponse,
                  variant: 'primary',
                },
                {
                  label: 'Cancel',
                  onClick: closeModal,
                  variant: 'secondary',
                },
              ]
            : [
                {
                  label: modalMode === 'respond' ? 'Submit' : 'Update',
                  onClick: handleResponseSubmit,
                  variant: 'primary',
                },
                {
                  label: 'Cancel',
                  onClick: closeModal,
                  variant: 'secondary',
                },
              ]
        }
      >
        {modalMode !== 'delete' ? (
          <textarea
            className={styles.reviewInput}
            value={responseText}
            placeholder="Write your response..."
            onChange={(e) => setResponseText(e.target.value)}
          />
        ) : (
          <p>Are you sure you want to delete this response?</p>
        )}
      </ModalPopup>
    </div>
  );
};

export default ReviewsTable;
