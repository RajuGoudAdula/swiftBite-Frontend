import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Html5QrcodeScanner } from "html5-qrcode";
import ModalPopup from "../../components/common/ModalPopup";
import styles from "../../styles/OrderManagement.module.css";
import canteenApi from "../../api/canteenApi";

const OrderManagement = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [preparingOrders, setPreparingOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);  // New state for cancelled orders
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);
  const [scannedOrder, setScannedOrder] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredStatus, setFilteredStatus] = useState(false);
  const scannerRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  // Define allowed status transitions
  const statusTransitions = {
    "Pending": ["Preparing", "Ready For Pickup", "Cancelled"],
    "Preparing": ["Ready For Pickup", "Cancelled"],
    "Ready For Pickup": ["Completed", "Cancelled"],
    "Cancelled": []  // Once cancelled, no further transitions are allowed
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrdersByStatus(selectedStatus);
  }, [filteredStatus]);

  const fetchOrders = async () => {
    try {
      const canteenId = user.canteen._id;
      const response = await canteenApi.getOrders(canteenId);
      const orders = response.data.orders;
      setPendingOrders(orders.filter(order => order.orderStatus === "Pending"));
      setPreparingOrders(orders.filter(order => order.orderStatus === "Preparing"));
      setReadyOrders(orders.filter(order => order.orderStatus === "Ready For Pickup"));
      setCompletedOrders(orders.filter(order => order.orderStatus === "Completed"));
      setCancelledOrders(orders.filter(order => order.orderStatus === "Cancelled"));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  const filterOrdersByStatus = (status) => {
    setSelectedStatus(status);
  };

  const handleStatusChange = async (orderId, newStatus, event) => {
    event.stopPropagation();
    try {
      const response = await canteenApi.updateOrderStatus({
        status: newStatus,
        orderId,
      });
  
      if (response.status === 200) {
        const updatedOrder = response.data.order;
        console.log(updatedOrder);

        await setFilteredStatus(!filteredStatus);
        // Remove order from the previous array based on old status
        setPendingOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
        setPreparingOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
        setReadyOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
        setCompletedOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
        setCancelledOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));

        // Add order to the new status array
        if (newStatus === "Pending") setPendingOrders(prev => [...prev, updatedOrder]);
        if (newStatus === "Preparing") setPreparingOrders(prev => [...prev, updatedOrder]);
        if (newStatus === "Ready For Pickup") setReadyOrders(prev => [...prev, updatedOrder]);
        if (newStatus === "Completed") setCompletedOrders(prev => [...prev, updatedOrder]);
        if (newStatus === "Cancelled") setCancelledOrders(prev => [...prev, updatedOrder]);
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { qrbox: { width: 250, height: 250 }, fps: 5 },
      false
    );

    scanner.render(
      (result) => {
        const order = [...pendingOrders, ...preparingOrders, ...readyOrders, ...completedOrders, ...cancelledOrders].find(
          (order) => order.orderId === result
        );
        if (order) {
          setScannedOrder(order);
          setIsModalOpen(true);
        } else {
          alert("Order not found!");
        }
        scanner.clear();
        scannerRef.current.innerHTML = "";
      },
      (error) => console.error("Scan Error:", error)
    );
  };

  // Helper function to determine if status should be changeable in list view
  const shouldShowStatusDropdown = (orderStatus) => {
    return orderStatus !== "Ready For Pickup" && orderStatus !== "Cancelled";
  };

  const renderOrders = (orders,status) => {
    if(orders.length === 0){
      return <p>No {status} Orders.</p>
    }
    return   orders.map((order, index) => (
        <div
          key={index}
          className={`${styles.orderCard} ${highlightedOrderId === order.orderId ? styles.highlighted : ""}`}
          onClick={() => setHighlightedOrderId(order.orderId === highlightedOrderId ? null : order.orderId)}
        >
          <div className={styles.orderHeader}>
            <div className={styles.orderId}>Order #{order.orderId}</div>
            <div className={`${styles.statusBadge} ${styles[order.orderStatus.replace(/\s+/g, '')]}`}>
              {order.orderStatus}
            </div>
          </div>
          
          <div className={styles.orderContent}>
            <div className={styles.items}>
              {order.items.map((item, index) => (
                <div key={index} className={styles.item}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemQuantity}>× {item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className={styles.orderTotal}>₹{order.totalAmount}</div>
          </div>

          {highlightedOrderId === order.orderId && (
            <div className={styles.orderDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Customer:</span>
                <span>{order?.user?.name} ({order?.user?.email})</span>
              </div>
              
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Payment:</span>
                <span className={`${styles.statusBadge} ${styles[order?.payment?.status.replace(/\s+/g, '')]}`}>
                  {order?.payment?.method} ({order?.payment?.status})
                </span>
              </div>
              
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Payment ID:</span>
                <span>{order?.payment?.paymentId}</span>
              </div>
              
              <div className={styles.statusControl}>
                <label>Update Status:</label>
                {shouldShowStatusDropdown(order?.orderStatus) ? (
                  <select
                    value={order?.orderStatus}
                    onChange={(e) => handleStatusChange(order?.orderId, e.target.value, e)}
                    className={styles.statusSelect}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value={order.orderStatus}>{order?.orderStatus}</option>
                    {statusTransitions[order.orderStatus]?.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className={styles.scanMessage}>
                    {order.orderStatus === "Cancelled" ? "Order Cancelled" : "Scan QR code to mark as Completed"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Order Management</h1>
        <button className={styles.scanButton} onClick={startScanner}>
          Scan QR Code
        </button>
      </div>

      <div id="qr-reader" ref={scannerRef} className={styles.qrScanner}></div>

      <div className={styles.statusButtons}>
        {["Pending", "Preparing", "Ready For Pickup", "Completed", "Cancelled"].map((status) => (
          <button
            key={status}
            className={`${styles.statusButton} ${selectedStatus === status ? styles.active : ""}`}
            onClick={() => filterOrdersByStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className={styles.orderList}>
        {loading ? (
            <div className={styles.loadingMessage}>Loading orders...</div> 
          ) : (
            <>
              {selectedStatus === "Pending" && renderOrders(pendingOrders,"Pending")}
              {selectedStatus === "Preparing" && renderOrders(preparingOrders,"Preparing")}
              {selectedStatus === "Ready For Pickup" && renderOrders(readyOrders,"Ready For Pickup")}
              {selectedStatus === "Completed" && renderOrders(completedOrders,"Completed")}
              {selectedStatus === "Cancelled" && renderOrders(cancelledOrders,"Cancelled")}
            </>
          )}
      </div>

            {/* Modal for Scanned Order */}
            <ModalPopup 
                isOpen={isModalOpen}
                title={`Order #${scannedOrder?.orderId || " "}`}
                onClose={() => setIsModalOpen(false)}
              >
                {scannedOrder && (
                  <div className={styles.modalContent}>
                    <div className={styles.modalSection}>
                      <h3>Items</h3>
                      <ul className={styles.modalItems}>
                        {scannedOrder.items.map((item, index) => (
                          <li key={index} className={styles.modalItem}>
                            <span>{item.name}</span>
                            <span>× {item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className={styles.modalSection}>
                      <h3>Customer Details</h3>
                      <div className={styles.detailRow}>
                        <span>Name:</span>
                        <span>{scannedOrder.user.name}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Email:</span>
                        <span>{scannedOrder.user.email}</span>
                      </div>
                    </div>
                    
                    <div className={styles.modalSection}>
                      <h3>Payment</h3>
                      <div className={styles.detailRow}>
                        <span>Method:</span>
                        <span>{scannedOrder.payment.method}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Status:</span>
                        <span>{scannedOrder.payment.status}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Amount:</span>
                        <span>₹{scannedOrder.totalAmount}</span>
                      </div>
                    </div>
                    
                    <div className={styles.statusControl}>
                      <label>Update Status:</label>
                      <select
                        value={scannedOrder.orderStatus}
                        onChange={(e) => {
                          handleStatusChange(scannedOrder.orderId, e.target.value, e);
                          setIsModalOpen(false);
                        }}
                        className={styles.statusSelect}
                      >
                        <option value={scannedOrder.orderStatus}>{scannedOrder.orderStatus}</option>
                        {statusTransitions[scannedOrder.orderStatus]?.map((status, index) => (
                          <option key={index} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </ModalPopup>
    </div>
  );
};

export default OrderManagement;
