import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import canteenApi from "../../api/canteenApi";
import styles from "../../styles/CanteenReviewPage.module.css";

const CanteenReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("reviews");
  const [loading, setLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await canteenApi.getReviews(user.canteen._id);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
    setLoading(false);
  };

  const handleReply = async (reviewId, text) => {
    if (!text.trim()) return;
    setReplyLoading(reviewId);
    try {
      await canteenApi.replayReview(reviewId, text);
      fetchReviews();
    } catch (err) {
      console.error("Reply error:", err);
    }
    setReplyLoading(null);
  };

  const unreplied = reviews.filter((r) => !r?.canteenResponse?.text);
  const replied = reviews.filter((r) => r?.canteenResponse?.text);
  const showReviews = activeTab === "reviews" ? unreplied : replied;

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`${styles.tabButton} ${
            activeTab === "reviews" ? styles.tabButtonActive : styles.tabButtonInactive
          }`}
        >
          Reviews ({unreplied.length})
        </button>
        <button
          onClick={() => setActiveTab("replied")}
          className={`${styles.tabButton} ${
            activeTab === "replied" ? styles.tabButtonActive : styles.tabButtonInactive
          }`}
        >
          Replied ({replied.length})
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : showReviews.length === 0 ? (
        <div className={styles.emptyState}>No reviews to display</div>
      ) : (
        showReviews.map((rev) => (
          <ReviewCard
            key={rev.reviewId}
            review={rev}
            onReply={handleReply}
            loading={replyLoading === rev.reviewId}
            showReplyBox={activeTab === "reviews"}
          />
        ))
      )}
    </div>
  );
};

const ReviewCard = ({ review, onReply, showReplyBox, loading }) => {
  const [text, setText] = useState("");

  return (
    <div className={styles.reviewCard}>
      <div className={styles.header}>
        <h2 className={styles.userName}>
          {review.isAnonymous ? "Anonymous User" : review.user?.name || "User"}
        </h2>
        <div className={styles.rating}>
          ⭐ {review.rating}/5
        </div>
      </div>

      <p className={styles.date}>
        Reviewed on {new Date(review.createdAt).toLocaleString()}
      </p>

      {/* User Information */}
      {review.user && (
        <div className={styles.section}>
          <p className={styles.text}>
            <strong>Email:</strong> {review.user.email || "N/A"}
          </p>
        </div>
      )}

      {/* Order Information */}
      {review.order && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Order Details</h3>
          <p className={styles.text}>
            <strong>Order ID:</strong> {review.order._id?.slice(-8) || "N/A"}
          </p>
          <p className={styles.text}>
            <strong>Order Date:</strong>{" "}
            {new Date(review.order.createdAt).toLocaleString()}
          </p>
          <p className={styles.text}>
            <strong>Payment:</strong> {review.order.paymentMethod} • {review.order.paymentStatus}
          </p>
          <p className={styles.text}>
            <strong>Total:</strong> ₹{review.order.totalAmount}
          </p>
          
          {/* Order Items */}
          {review.order.items && review.order.items.length > 0 && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Items</h4>
              {review.order.items.map((item, index) => (
                <div key={index} className={styles.orderItem}>
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className={styles.orderItemImage}
                    />
                  )}
                  <div className={styles.orderItemDetails}>
                    <div className={styles.orderItemName}>{item.name}</div>
                    <div className={styles.orderItemPrice}>
                      ₹{item.price} × {item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Review Content */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Review</h3>
        <p className={styles.text}>{review.review}</p>
      </div>

      {/* Review Images */}
      {review.images?.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Images</h3>
          <div className={styles.reviewImages}>
            {review.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="review"
                className={styles.reviewImage}
              />
            ))}
          </div>
        </div>
      )}

      {/* Likes/Dislikes */}
      <div className={styles.section}>
        <div className={styles.reactionCount}>
          <span className={styles.likes}>
            {review.likes?.length || 0} Likes
          </span>
          <span className={styles.dislikes}>
            {review.dislikes?.length || 0} Dislikes
          </span>
        </div>
      </div>

      {/* Reply Section */}
      {showReplyBox ? (
        <div className={styles.replyBox}>
          <textarea
            className={styles.replyTextarea}
            rows={3}
            placeholder="Write your reply..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className={styles.replyButton}
            onClick={() => onReply(review.reviewId, text)}
            disabled={loading}
          >
            {loading ? "Sending..." : "Reply"}
          </button>
        </div>
      ) : (
        review.canteenResponse?.text && (
          <div className={styles.replyContainer}>
            <div className={styles.replyHeader}>Canteen Response</div>
            <p className={styles.text}>{review.canteenResponse.text}</p>
            <div className={styles.replyDate}>
              Replied on{" "}
              {review.canteenResponse.respondedAt
                ? new Date(review.canteenResponse.respondedAt).toLocaleString()
                : "Pending"}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CanteenReviewPage;