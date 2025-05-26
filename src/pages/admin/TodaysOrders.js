import React, { useEffect, useState } from 'react';
import { FaUser, FaUniversity, FaStore, FaMoneyBill, FaCheckCircle } from 'react-icons/fa';
import adminApi from '../../api/adminApi';
import styles from '../../styles/TodaysOrders.module.css';

const TodaysOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodaysOrders = async () => {
      try {
        const response = await adminApi.getTodaysOrders();
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error('Error fetching today’s orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysOrders();
  }, []);

  if (loading) return <p>Loading today’s orders...</p>;

  return (
    <div className={styles.todaysOrders}>
      <h2>Today's Orders</h2>
      {orders.length === 0 ? (
        <p>No orders placed today.</p>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <h3>Order ID: {order._id}</h3>
                <p title='User Name'><FaUser className="icon" /><strong>:</strong> {order.userId?.name}</p>
                <p title='College Name'><FaUniversity className="icon" /><strong>:</strong> {order.collegeId?.name}</p>
                <p title='Canteen Name'><FaStore className="icon" /><strong>:</strong> {order.canteenId?.name}</p>
                <p title='Total Amount'><FaMoneyBill className="icon" /><strong>:</strong> ₹{order.totalAmount}</p>
                <p title='Order Status'><FaCheckCircle className="icon" /><strong>:</strong> {order.orderStatus}</p>
                <p title='Payment Status'><strong>Payment:</strong> {order.paymentStatus} ({order.paymentMethod})</p>
              <div className={styles.itemsList} title='Items'>
                <strong>Items:</strong>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.productId?.name} × {item.quantity} — ₹{item.totalPrice}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodaysOrders;
