import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, cancelOrder } from "../../store/slices/orderSlice";
import {
  addReview,
  updateReview,
  deleteReview,
  fetchReviewOfUser,
} from "../../store/slices/reviewSlice";
import { QRCodeCanvas } from "qrcode.react";
import styles from '../../styles/Order.module.css';

function Order() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);
  const { reviews: fetchedReviews } = useSelector((state) => state.reviews) || {};

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [qrVisible, setQrVisible] = useState(false);
  const [reviews, setReviews] = useState({});
  const [editMode, setEditMode] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user?.id && user?.college?._id) {
      dispatch(fetchOrders({ userId: user.id, canteenId: user.canteen._id }));
    }
  }, [user?.id, user?.college?._id, dispatch]);

  useEffect(() => {
    setReviews(fetchedReviews?.reviews);
  }, [fetchedReviews, dispatch, editMode,]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const handleSelectOrder = (order) => {
    if (isMobile) {
      if (expandedOrder === order._id) {
        setExpandedOrder(null);
      } else {
        setExpandedOrder(order._id);
        setSelectedOrder(order);
        dispatch(fetchReviewOfUser({ orderId: order._id, userId: user.id }));
      }
    } else {
      setSelectedOrder(order);
      dispatch(fetchReviewOfUser({ orderId: order._id, userId: user.id }));
    }
  };

  const handleQrToggle = (event) => {
    event.stopPropagation();
    setQrVisible(!qrVisible);
  };

  const handleCancel = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      dispatch(cancelOrder(orderId));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(null);
      }
    }
  };

  const handleReviewChange = (productId, field, value) => {
    setReviews((prevReviews) => ({
      ...prevReviews,
      [productId]: {
        ...prevReviews[productId],
        [field]: value,
      },
    }));
  };

  const handleSubmitReview = (productId) => {
    const reviewData = {
      productId,
      userId: user.id,
      orderId: selectedOrder._id,
      collegeId: user.college._id,
      canteenId: selectedOrder.canteenId,
      rating: reviews[productId]?.rating || 1,
      review: reviews[productId]?.review || "",
    };
    dispatch(updateReview(reviewData));
    setEditMode(null);
  };

  const handleDeleteReview = (productId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview({ 
        productId, 
        orderId: selectedOrder._id, 
        userId: user.id 
      }));
      setEditMode(null);
      setReviews({});
    }
  };

  const handleNewReview = (productId) => {
    dispatch(addReview({
      productId,
      orderId: selectedOrder._id,
      canteenId: selectedOrder.canteenId,
      review: newReview,
      rating: newRating,
      userId: user.id,
      collegeId: user.college._id
    }));
    setNewReview("");
    setNewRating(1);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return styles.statusCompleted;
      case 'cancelled': return styles.statusCancelled;
      case 'pending': return styles.statusPending;
      case 'preparing': return styles.statusPreparing;
      case 'ready': return styles.statusReady;
      default: return styles.statusDefault;
    }
  };

  return (
    <div className={isMobile ? styles.mobileContainer : styles.desktopContainer}>
      {/* Orders List */}
      <div className={isMobile ? styles.mobileOrderList : styles.desktopOrderList}>
        <h2 className={styles.sectionTitle}>Your Orders</h2>

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {Array.isArray(orders) && orders.length > 0 ? (
          <div className={styles.orderItems}>
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                <div
                  className={`${styles.orderCard} ${
                    (isMobile ? expandedOrder === order._id : selectedOrder?._id === order._id) 
                      ? styles.selected 
                      : ''
                  }`}
                  onClick={() => handleSelectOrder(order)}
                >
                  <div className={styles.orderPreview}>
                    <div className={styles.orderPreviewFirstPart}>
                      <div className={styles.orderImages}>
                        {order.items.slice(0, 3).map((item, index) => (
                          <img
                            src={item?.image || "/default-image.jpg"}
                            key={`${item._id}-${index}`}
                            alt="item"
                            className={styles.orderItemImage}
                            style={{ zIndex: 3 - index }}
                          />
                        ))}
                        {order.items.length > 3 && (
                          <div className={styles.moreItems}>+{order.items.length - 3}</div>
                        )}
                      </div>
                      <div className={`${styles.orderStatus} ${getStatusColor(order.orderStatus.split(" ")[0])}`}>
                        {order.orderStatus}
                      </div>
                    </div>
                    <div className={styles.orderInfo}>
                      <div className={styles.orderDate}>{formatDate(order.createdAt)}</div>
                      <div className={styles.orderTotal}>₹{order.totalAmount}</div>
                      <div>
                        {order.orderStatus.toLowerCase() !== 'cancelled' && (
                          <button 
                            className={styles.cancelButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancel(order._id);
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Order Details - appears inline */}
                {isMobile && expandedOrder === order._id && (
                  <div className={styles.mobileOrderDetails}>
                    <div className={styles.orderHeader}>
                      <h3 className={styles.orderId}>Order #{order._id}</h3>
                      <div className={styles.orderHeaderBelow}>
                        <div className={`${styles.orderStatus} ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </div>
                        <div>
                          <button 
                            className={styles.qrButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQrToggle(e);
                            }}
                          >
                            {qrVisible ? 'Hide QR' : 'Show QR'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {qrVisible && (
                      <div className={styles.qrContainer}>
                        <QRCodeCanvas 
                          value={order._id} 
                          size={160} 
                          level="Q" 
                        />
                        <p className={styles.qrNote}>Show this QR code to collect your order</p>
                      </div>
                    )}

                    <h4 className={styles.itemsTitle}>Items ({order.items?.length})</h4>
                    <div className={styles.itemsList}>
                      {order.items?.map((item) => (
                        <div key={item._id} className={styles.itemCard}>
                          <img
                            src={item?.image || "/default-image.jpg"}
                            alt={item.name}
                            className={styles.itemImage}
                          />
                          <div className={styles.itemDetails}>
                            <h5 className={styles.itemName}>{item.name}</h5>
                            <div className={styles.itemPriceRow}>
                              <span>₹{item.price} × {item.quantity}</span>
                              <span className={styles.itemTotal}>₹{item.totalPrice}</span>
                            </div>
                            
                            {/* Review Section - Mobile Optimized */}
                            <div className={styles.reviewSection}>
                              {(fetchedReviews?.orderId === order._id && reviews?.[item.productId]) ? (
                                <div className={styles.existingReview}>
                                  {editMode === item.productId ? (
                                    <div className={styles.editReview}>
                                      <textarea
                                        className={styles.reviewInput}
                                        placeholder="Write your review..."
                                        value={reviews[item.productId]?.review || ""}
                                        onChange={(e) => handleReviewChange(item.productId, "review", e.target.value)}
                                      />
                                      <div className={styles.ratingRow}>
                                        <label>Rating:</label>
                                        <select
                                          className={styles.ratingSelect}
                                          value={reviews[item.productId]?.rating || 1}
                                          onChange={(e) => handleReviewChange(item.productId, "rating", Number(e.target.value))}
                                        >
                                          {[1, 2, 3, 4, 5].map(num => (
                                            <option key={num} value={num}>{num} ★</option>
                                          ))}
                                        </select>
                                      </div>
                                      <div className={styles.reviewButtons}>
                                        <button 
                                          className={styles.submitButton}
                                          onClick={() => handleSubmitReview(item.productId)}
                                        >
                                          Update
                                        </button>
                                        <button 
                                          className={styles.cancelButton}
                                          onClick={() => setEditMode(null)}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className={styles.reviewDisplay}>
                                      <div className={styles.reviewRating}>
                                        Rating: <span className={styles.ratingStars}>
                                          {'★'.repeat(reviews[item.productId]?.rating)}
                                          {'☆'.repeat(5 - (reviews[item.productId]?.rating || 0))}
                                        </span>
                                      </div>
                                      <p className={styles.reviewText}>{reviews[item.productId]?.review}</p>
                                      <div>
                                        {reviews[item.productId]?.canteenResponse?.text && (
                                          <div>
                                            <h5>Canteen Response</h5>
                                            <p>Reply : {reviews[item.productId]?.canteenResponse?.text}</p>
                                            <p>respondedAt : {reviews[item.productId]?.canteenResponse?.respondedAt} </p>
                                          </div>
                                        )}
                                      </div>
                                      <div className={styles.reviewButtons}>
                                        {!reviews[item.productId]?.canteenResponse?.text && <button 
                                          className={styles.editButton}
                                          onClick={() => setEditMode(item.productId)}
                                        >
                                          Edit
                                        </button>}
                                        <button 
                                          className={styles.deleteButton}
                                          onClick={() => handleDeleteReview(item.productId)}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className={styles.newReview}>
                                  <label><strong>Add Review</strong></label>
                                  <textarea
                                    className={styles.reviewInput}
                                    placeholder="Share your experience with this item..."
                                    value={newReview}
                                    onChange={(e) => setNewReview(e.target.value)}
                                  />
                                  <div className={styles.ratingRow}>
                                    <label>Rating:</label>
                                    <select
                                      className={styles.ratingSelect}
                                      value={newRating}
                                      onChange={(e) => setNewRating(Number(e.target.value))}
                                    >
                                      {[1, 2, 3, 4, 5].map(num => (
                                        <option key={num} value={num}>{num} ★</option>
                                      ))}
                                    </select>
                                  </div>
                                  <button
                                    className={styles.submitButton}
                                    onClick={() => handleNewReview(item.productId)}
                                  >
                                    Submit Review
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          !loading && (
            <div className={styles.noOrders}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="#86868B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 6H21" stroke="#86868B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="#86868B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>No orders found</p>
            </div>
          )
        )}
      </div>

      {/* Desktop Order Details */}
      {!isMobile && selectedOrder && (
        <div className={styles.desktopOrderDetails}>
           <div className={styles.orderHeader}>
            <h3 className={styles.orderId}>Order #{selectedOrder._id}</h3>
            <div className={styles.orderHeaderBelow}>
              <div className={`${styles.orderStatus} ${getStatusColor(selectedOrder.orderStatus)}`}>
                {selectedOrder.orderStatus}
              </div>
              <div>
                <button 
                  className={styles.qrButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQrToggle(e);
                  }}
                >
                  {qrVisible ? 'Hide QR' : 'Show QR'}
                </button>
              </div>
            </div>
          </div>

          {qrVisible && (
            <div className={styles.qrContainer}>
              <QRCodeCanvas 
                value={selectedOrder._id} 
                size={160} 
                level="Q" 
              />
              <p className={styles.qrNote}>Show this QR code to collect your order</p>
            </div>
          )}

          <h4 className={styles.itemsTitle}>Items ({selectedOrder.items?.length})</h4>
          <div className={styles.itemsList}>
            {selectedOrder.items?.map((item) => (
              <div key={item._id} className={styles.itemCard}>
                <div className={styles.itemCardHeader}>
                  <img
                    src={item?.image || "/default-image.jpg"}
                    alt={item.name}
                    className={styles.itemImage}
                  />
                  <div className={styles.itemCardNameSection}>
                    <h5 className={styles.itemName}>{item.name}</h5>
                    <div className={styles.itemPriceRow}>
                      <span>₹{item.price} × {item.quantity}</span>
                      <span className={styles.itemTotal}>₹{item.totalPrice}</span>
                    </div>
                  </div>

                </div>
                <div className={styles.itemDetails}>
                  
                  {/* Review Section */}
                  <div className={styles.reviewSection}>
                    {(fetchedReviews?.orderId === selectedOrder._id && reviews?.[item.productId]) ? (
                      <div className={styles.existingReview}>
                        {editMode === item.productId ? (
                          <div className={styles.editReview}>
                            <textarea
                              className={styles.reviewInput}
                              placeholder="Write your review..."
                              value={reviews[item.productId]?.review || ""}
                              onChange={(e) => handleReviewChange(item.productId, "review", e.target.value)}
                            />
                            <div className={styles.ratingRow}>
                              <label>Rating:</label>
                              <select
                                className={styles.ratingSelect}
                                value={reviews[item.productId]?.rating || 1}
                                onChange={(e) => handleReviewChange(item.productId, "rating", Number(e.target.value))}
                              >
                                {[1, 2, 3, 4, 5].map(num => (
                                  <option key={num} value={num}>{num} ★</option>
                                ))}
                              </select>
                            </div>
                            <div className={styles.reviewButtons}>
                              <button 
                                className={styles.submitButton}
                                onClick={() => handleSubmitReview(item.productId)}
                              >
                                Update
                              </button>
                              <button 
                                className={styles.cancelButton}
                                onClick={() => setEditMode(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className={styles.reviewDisplay}>
                            <div className={styles.reviewRating}>
                              Rating: <span className={styles.ratingStars}>
                                {'★'.repeat(reviews[item.productId]?.rating)}
                                {'☆'.repeat(5 - (reviews[item.productId]?.rating || 0))}
                              </span>
                            </div>
                            <p className={styles.reviewText}>{reviews[item.productId]?.review}</p>
                            <div>
                              {reviews[item.productId]?.canteenResponse?.text && (
                                <div>
                                  <h5>Canteen Response</h5>
                                  <p>Reply : {reviews[item.productId]?.canteenResponse?.text}</p>
                                  <p>respondedAt : {reviews[item.productId]?.canteenResponse?.respondedAt} </p>
                                </div>
                              )}
                            </div>
                            <div className={styles.reviewButtons}>
                              {!reviews[item.productId]?.canteenResponse?.text && <button 
                                className={styles.editButton}
                                onClick={() => setEditMode(item.productId)}
                              >
                                Edit
                              </button>}
                              <button 
                                className={styles.deleteButton}
                                onClick={() => handleDeleteReview(item.productId)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={styles.newReview}>
                        <label><strong>Add Review</strong></label>
                        <textarea
                          className={styles.reviewInput}
                          placeholder="Share your experience with this item..."
                          value={newReview}
                          onChange={(e) => setNewReview(e.target.value)}
                        />
                        <div className={styles.ratingRow}>
                          <label>Rating:</label>
                          <select
                            className={styles.ratingSelect}
                            value={newRating}
                            onChange={(e) => setNewRating(Number(e.target.value))}
                          >
                            {[1, 2, 3, 4, 5].map(num => (
                              <option key={num} value={num}>{num} ★</option>
                            ))}
                          </select>
                        </div>
                        <button
                          className={styles.submitButton}
                          onClick={() => handleNewReview(item.productId)}
                        >
                          Submit Review
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;