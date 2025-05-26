import React, { useEffect, useState ,} from "react";
import { useDispatch, useSelector, } from "react-redux";
import { fetchOrders, cancelOrder } from "../../store/slices/orderSlice";
import {
  addReview,
  updateReview,
  deleteReview,
  fetchReviewOfUser,
} from "../../store/slices/reviewSlice";
import { QRCodeCanvas } from "qrcode.react";
import styles from '../../styles/Order.module.css';
import ModalPopup from "../../components/common/ModalPopup";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


function Order() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const [isAnonymous,setIsAnonymous] = useState(false);
  
 useEffect(()=>{
  console.log(orders);
 },[orders]);

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
      isAnonymous: reviews[productId]?.isAnonymous || false,
    };
    dispatch(updateReview(reviewData));
    setEditMode(null);
    setIsAnonymous(false);
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
      collegeId: user.college._id,
      isAnonymous,
    })).then(()=>{
      dispatch(fetchReviewOfUser({ userId: user.id, orderId:  selectedOrder._id }));
    })
    setNewReview("");
    setNewRating(1);
    setEditMode(null);
    setIsAnonymous(false);
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
        <div className={styles.titleSection}>
          <h2 className={styles.sectionTitle}>Your Orders</h2>
          <button className={styles.previousButton} onClick={() => navigate('/previous-orders')}>Previous Orders</button>
        </div>
        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {!loading && Array.isArray(orders) && orders.length > 0 ? (
          <div className={styles.orderItems}>
            {orders.map((order) => ( (
              (order.orderStatus.toLowerCase() !== "completed") || (
                new Date(order.updatedAt).getDate() === new Date().getDate() && 
                new Date(order.updatedAt).getMonth() === new Date().getMonth() && 
                new Date(order.updatedAt).getYear() === new Date().getYear() 
              )
            ) &&
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
                            src={item?.productId?.image || "/default-image.jpg"}
                            key={`${item._id}-${index}`}
                            alt="item"
                            className={styles.orderItemImage}
                            style={{ zIndex: 3 - index }}
                          />
                        ))}
                        {order.items.length > 3 && (
                          <div className={styles.moreItems}>.....</div>
                        )}
                      </div>
                      <div className={`${styles.orderStatus} ${getStatusColor(order.orderStatus.split(" ")[0])}`}>
                        {order.orderStatus}
                      </div>
                    </div>
                    <div className={styles.orderInfo}>
                      <div className={styles.orderDate}>{formatDate(order.createdAt)}</div>
                      <div className={styles.orderTotal}>₹{order.totalAmount}</div>
                        {order.orderStatus.toLowerCase() === 'pending' && (
                        <div>
                            <button 
                              className={styles.cancelButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancel(order._id);
                              }}
                            >
                              Cancel
                            </button>
                        </div>
                        )}
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

                    <h4 className={styles.itemsTitle}>Items Details</h4>
                    <div className={styles.itemsList}>
                        {order.items?.map((item) => (
                          <div key={item._id} style={{borderBottom: "solid 1px #80808042"}}>
                            <div className={styles.itemCard}>
                              <img
                                src={item?.productId?.image || "/default-image.jpg"}
                                alt={item.name}
                                className={styles.itemImage}
                              />
                              <div className={styles.itemDetails}>
                                <h5 className={styles.itemName}>{item?.productId?.name} - {item?.quantity}</h5>
                                <span className={styles.itemUnits}>
                                  {item.productId?.netWeight}. 1{item?.productId?.unit}
                                </span>
                              </div>
                              <div className={styles.priceAndReview}>
                                <div className={styles.itemPriceRow}>
                                  {item.offers?.length > 0 ? (
                                    <div>
                                      <span className={styles.originalPrice}>
                                        ₹{item?.price*item?.quantity}
                                      </span>
                                      <span className={styles.itemTotal}>₹{item.totalPrice}</span>
                                    </div>
                                  ) : (
                                    <span className={styles.itemTotal}>₹{item.totalPrice}</span>
                                  )}
                                </div>

                                {/* Add Review Button */}
                                {order.orderStatus?.toLowerCase() === "completed" && (
                                  <div className={styles.reviewSection}>
                                    {!(
                                      fetchedReviews?.orderId === order._id &&
                                      reviews?.[item.productId._id]
                                    ) && (
                                      <div className={styles.newReview}>
                                        <button
                                          className={styles.submitButton}
                                          onClick={() => setEditMode(item.productId._id)}
                                        >
                                          Add Review
                                        </button>

                                        <ModalPopup
                                          isOpen={editMode === item.productId._id}
                                          title="Add Review"
                                          onClose={() => setEditMode(null)}
                                          buttons={[
                                            {
                                              label: "Submit",
                                              onClick: () => handleNewReview(item.productId._id),
                                              variant: "primary",
                                            },
                                            {
                                              label: "Cancel",
                                              onClick: () => setEditMode(null),
                                              variant: "secondary",
                                            },
                                          ]}
                                        >
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
                                              {[1, 2, 3, 4, 5].map((num) => (
                                                <option key={num} value={num}>
                                                  {num} ★
                                                </option>
                                              ))}
                                            </select>
                                            <label>
                                              <input
                                                type="checkbox"
                                                checked={isAnonymous}
                                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                              />
                                              Post anonymously
                                            </label>
                                          </div>
                                        </ModalPopup>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Existing Review Display */}
                            {fetchedReviews?.orderId === order._id && reviews?.[item.productId._id] && (
                              <div className={styles.existingReview}>
                                <div className={styles.reviewDisplay}>
                                  <p>
                                    {reviews[item.productId._id]?.isAnonymous ? 
                                    <FaUserCircle size={24} />
                                    : 
                                    <FaUserCircle size={24} color="#007AFF" />                           
                                    }
                                  </p>
                                  <div className={styles.reviewRating}>
                                    <p className={styles.reviewText}>
                                      {reviews[item.productId._id]?.review}
                                    </p>
                                    <span className={styles.ratingStars}>
                                      {"★".repeat(reviews[item.productId._id]?.rating || 0)}
                                      {"☆".repeat(5 - (reviews[item.productId._id]?.rating || 0))}
                                    </span>
                                  </div>


                                  <div className={styles.reviewButtons}>
                                    {!reviews[item.productId._id]?.canteenResponse?.text && (
                                      <button
                                        className={styles.editButton}
                                        onClick={() => setEditMode(item.productId._id)}
                                      >
                                       <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#007AFF"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                      </svg>
                                      </button>
                                    )}
                                    <button
                                      className={styles.deleteButton}
                                      onClick={() => handleDeleteReview(item.productId._id)}
                                    >
                                       <svg
                                          className={styles.deleteIcon}
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
                                        </svg>
                                    </button>
                                  </div>
                                </div>
                                {reviews[item.productId._id]?.canteenResponse?.text && (
                                    <div>
                                      <h5>Canteen Response</h5>
                                      <p>Reply: {reviews[item.productId._id]?.canteenResponse?.text}</p>
                                      <p>
                                        respondedAt:{" "}
                                        {reviews[item.productId._id]?.canteenResponse?.respondedAt}
                                      </p>
                                    </div>
                                  )}

                                {/* Edit Review Modal */}
                                <ModalPopup
                                  isOpen={editMode === item.productId._id}
                                  title="Edit Review"
                                  onClose={() => setEditMode(null)}
                                  buttons={[
                                    {
                                      label: "Update",
                                      onClick: () => handleSubmitReview(item.productId._id),
                                      variant: "primary",
                                    },
                                    {
                                      label: "Cancel",
                                      onClick: () => setEditMode(null),
                                      variant: "secondary",
                                    },
                                  ]}
                                >
                                  <textarea
                                    className={styles.reviewInput}
                                    placeholder="Write your review..."
                                    value={reviews[item.productId._id]?.review || ""}
                                    onChange={(e) =>
                                      handleReviewChange(item.productId._id, "review", e.target.value)
                                    }
                                  />
                                  <div className={styles.ratingRow}>
                                    <label>Rating:</label>
                                    <select
                                      className={styles.ratingSelect}
                                      value={reviews[item.productId._id]?.rating || 1}
                                      onChange={(e) =>
                                        handleReviewChange(
                                          item.productId._id,
                                          "rating",
                                          Number(e.target.value)
                                        )
                                      }
                                    >
                                      {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>
                                          {num} ★
                                        </option>
                                      ))}
                                    </select>
                                    <label>
                                      <input
                                        type="checkbox"
                                        checked={reviews[item.productId._id]?.isAnonymous || false}
                                        onChange={(e) =>
                                          handleReviewChange(
                                            item.productId._id,
                                            "isAnonymous",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Post anonymously
                                    </label>
                                  </div>
                                </ModalPopup>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                    <h4 className={styles.itemsTitle}>Payment Details</h4>
                    <div className={styles.paymentSection}>
                        <label className={styles.paymentLabel}>
                          <p className={styles.paymentText}><strong>Payment ID : </strong></p>
                          <p className={styles.paymentValue}>{order.paymentId}</p>
                        </label>
                        <label className={styles.paymentLabel}>
                          <p className={styles.paymentText}><strong>Payment method : </strong></p>
                          <p className={styles.paymentValue}>{order.paymentMethod}</p>
                        </label>
                        <label className={styles.paymentLabel}>
                          <p className={styles.paymentText}><strong>TotalAmount paid : </strong></p>
                          <p className={styles.paymentValue}>₹{order.totalAmount}</p>
                        </label>
                    </div>
                    <h4 className={styles.itemsTitle}>Order Details</h4>
                    <div className={styles.orderSection}>
                      <label className={styles.orderLabel}>
                        <span className={styles.orderText}><strong>OrderId : </strong></span>
                        <span className={styles.orderValue}>#{order._id}</span>
                      </label>
                      <label className={styles.orderLabel}>
                        <span className={styles.orderText}><strong>Ordered from : </strong></span>
                        <span className={styles.orderValue}>{order.canteenId?.name},{order.collegeId?.name}</span>
                      </label>
                      <label className={styles.orderLabel}>
                        <span className={styles.orderText}><strong>Order Placed : </strong></span>
                        <span className={styles.orderValue}>{formatDate(order.createdAt)}</span>
                      </label>
                      <label className={styles.orderLabel}>
                        <span className={styles.orderText}><strong>Order {order.orderStatus} : </strong></span>
                        <span className={styles.orderValue}>{formatDate(order.updatedAt)}</span>
                      </label>
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

<h4 className={styles.itemsTitle}>Items Details</h4>
                    <div className={styles.itemsList}>
                        {selectedOrder.items?.map((item) => (
                          <div key={item._id} style={{borderBottom: "solid 1px #80808042"}}>
                            <div className={styles.itemCard}>
                              <img
                                src={item?.productId?.image || "/default-image.jpg"}
                                alt={item?.productId?.name}
                                className={styles.itemImage}
                              />
                              <div className={styles.itemDetails}>
                                <h5 className={styles.itemName}>{item?.productId?.name}</h5>
                                <span className={styles.itemUnits}>
                                  {item?.productId?.netWeight}. 1{item?.productId?.unit}
                                </span>
                              </div>
                              <div className={styles.priceAndReview}>
                                <div className={styles.itemPriceRow}>
                                  {item.offers?.length > 0 ? (
                                    <div>
                                      <span>
                                        ₹
                                        {(
                                          item.totalPrice -
                                          ((item.price - (item.price * item.offers[0].discount) / 100) * item.quantity)
                                        ).toFixed(2)}
                                      </span>
                                      <span className={styles.itemTotal}>₹{item.totalPrice}</span>
                                    </div>
                                  ) : (
                                    <span className={styles.itemTotal}>₹{item.totalPrice}</span>
                                  )}
                                </div>

                                {/* Add Review Button */}
                                {selectedOrder.orderStatus?.toLowerCase() === "completed" && (
                                  <div className={styles.reviewSection}>
                                    {!(
                                      fetchedReviews?.orderId === selectedOrder._id &&
                                      reviews?.[item.productId._id]
                                    ) && (
                                      <div className={styles.newReview}>
                                        <button
                                          className={styles.submitButton}
                                          onClick={() => setEditMode(item.productId._id)}
                                        >
                                          Add Review
                                        </button>

                                        <ModalPopup
                                          isOpen={editMode === item.productId._id}
                                          title="Add Review"
                                          onClose={() => setEditMode(null)}
                                          buttons={[
                                            {
                                              label: "Submit",
                                              onClick: () => handleNewReview(item.productId._id),
                                              variant: "primary",
                                            },
                                            {
                                              label: "Cancel",
                                              onClick: () => setEditMode(null),
                                              variant: "secondary",
                                            },
                                          ]}
                                        >
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
                                              {[1, 2, 3, 4, 5].map((num) => (
                                                <option key={num} value={num}>
                                                  {num} ★
                                                </option>
                                              ))}
                                            </select>
                                            <label>
                                              <input
                                                type="checkbox"
                                                checked={isAnonymous}
                                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                              />
                                              Post anonymously
                                            </label>
                                          </div>
                                        </ModalPopup>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Existing Review Display */}
                            {fetchedReviews?.orderId === selectedOrder._id && reviews?.[item.productId._id] && (
                              <div className={styles.existingReview}>
                                <div className={styles.reviewDisplay}>
                                  <p>
                                    {reviews[item.productId._id]?.isAnonymous ? 
                                    <FaUserCircle size={40} />
                                    : 
                                    <FaUserCircle size={40} color="#007AFF" />                           
                                    }
                                  </p>
                                  <div className={styles.reviewRating}>
                                    <p className={styles.reviewText}>
                                      {reviews[item.productId._id]?.review}
                                    </p>
                                    <span className={styles.ratingStars}>
                                      {"★".repeat(reviews[item.productId._id]?.rating || 0)}
                                      {"☆".repeat(5 - (reviews[item.productId._id]?.rating || 0))}
                                    </span>
                                  </div>


                                  <div className={styles.reviewButtons}>
                                    {!reviews[item.productId._id]?.canteenResponse?.text && (
                                      <button
                                        className={styles.editButton}
                                        onClick={() => setEditMode(item.productId._id)}
                                      >
                                       <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#007AFF"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                      </svg>
                                      </button>
                                    )}
                                    <button
                                      className={styles.deleteButton}
                                      onClick={() => handleDeleteReview(item.productId._id)}
                                    >
                                       <svg
                                          className={styles.deleteIcon}
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
                                        </svg>
                                    </button>
                                  </div>
                                </div>
                                {reviews[item.productId._id]?.canteenResponse?.text && (
                                    <div>
                                      <h5>Canteen Response</h5>
                                      <p>Reply: {reviews[item.productId._id]?.canteenResponse?.text}</p>
                                      <p>
                                        respondedAt:{" "}
                                        {reviews[item.productId._id]?.canteenResponse?.respondedAt}
                                      </p>
                                    </div>
                                  )}

                                {/* Edit Review Modal */}
                                <ModalPopup
                                  isOpen={editMode === item.productId._id}
                                  title="Edit Review"
                                  onClose={() => setEditMode(null)}
                                  buttons={[
                                    {
                                      label: "Update",
                                      onClick: () => handleSubmitReview(item.productId._id),
                                      variant: "primary",
                                    },
                                    {
                                      label: "Cancel",
                                      onClick: () => setEditMode(null),
                                      variant: "secondary",
                                    },
                                  ]}
                                >
                                  <textarea
                                    className={styles.reviewInput}
                                    placeholder="Write your review..."
                                    value={reviews[item.productId._id]?.review || ""}
                                    onChange={(e) =>
                                      handleReviewChange(item.productId._id, "review", e.target.value)
                                    }
                                  />
                                  <div className={styles.ratingRow}>
                                    <label>Rating:</label>
                                    <select
                                      className={styles.ratingSelect}
                                      value={reviews[item.productId._id]?.rating || 1}
                                      onChange={(e) =>
                                        handleReviewChange(
                                          item.productId._id,
                                          "rating",
                                          Number(e.target.value)
                                        )
                                      }
                                    >
                                      {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>
                                          {num} ★
                                        </option>
                                      ))}
                                    </select>
                                    <label>
                                      <input
                                        type="checkbox"
                                        checked={reviews[item.productId._id]?.isAnonymous || false}
                                        onChange={(e) =>
                                          handleReviewChange(
                                            item.productId._id,
                                            "isAnonymous",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Post anonymously
                                    </label>
                                  </div>
                                </ModalPopup>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                    <h4 className={styles.itemsTitle}>Payment Details</h4>
                    <div className={styles.paymentSection}>
                        <label className={styles.paymentLabel}>
                          <p className={styles.paymentText}><strong>Payment ID : </strong></p>
                          <p className={styles.paymentValue}>{selectedOrder.paymentId}</p>
                        </label>
                        <label className={styles.paymentLabel}>
                          <p className={styles.paymentText}><strong>Payment method : </strong></p>
                          <p className={styles.paymentValue}>{selectedOrder.paymentMethod}</p>
                        </label>
                        <label className={styles.paymentLabel}>
                          <p className={styles.paymentText}><strong>TotalAmount paid : </strong></p>
                          <p className={styles.paymentValue}>₹{selectedOrder.totalAmount}</p>
                        </label>
                    </div>
                    <h4 className={styles.itemsTitle}>Order Details</h4>
                    <div className={styles.orderSection}>
                      <label className={styles.orderLabel}>
                        <span className={styles.orderText}><strong>OrderId : </strong></span>
                        <span className={styles.orderValue}>#{selectedOrder._id}</span>
                      </label>
                      <label className={styles.orderLabel}>
                        <span className={styles.orderText}><strong>Ordered from : </strong></span>
                        <span className={styles.orderValue}>{selectedOrder.canteenId?.name},{selectedOrder.collegeId?.name}</span>
                      </label>
                      <label className={styles.orderLabel}>
                        <span className={styles.orderText}><strong>Order Placed : </strong></span>
                        <span className={styles.orderValue}>{formatDate(selectedOrder.createdAt)}</span>
                      </label>
                      <label className={styles.orderLabel}>
                        <span className={styles.orderText}><strong>Order {selectedOrder.orderStatus} : </strong></span>
                        <span className={styles.orderValue}>{formatDate(selectedOrder.updatedAt)}</span>
                      </label>
                    </div>
        </div>
      )}
    </div>
  );
}

export default Order;