import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Orderscreen.css';

function Orderscreen() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('currentuser')));

  useEffect(() => {
    if (user) {
      fetchOrders();
      // Auto-refresh orders every 10 seconds to show status updates (reduced for testing)
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders for user:', user._id);
      const response = await axios.post('/api/orders/getordersbyuserid', {
        userid: user._id
      });
      console.log('Orders fetched:', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return '#ff9800';
      case 'Preparing': return '#2196f3';
      case 'Out for Delivery': return '#4caf50';
      case 'Delivered': return '#4caf50';
      case 'Cancelled': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put('/api/orders/cancelorder', { orderid: orderId });
      fetchOrders();
      alert('Order cancelled successfully');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    }
  };

  if (!user) {
    return <div>Please login to view your orders</div>;
  }

  return (
    <div className="orderscreen">
      <div className="orders-header">
        <h1>Your Orders</h1>
        <button className="refresh-btn" onClick={fetchOrders}>
           Refresh
        </button>
      </div>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <h2>No orders yet</h2>
          <p>Start ordering from your favorite restaurants!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <p>{order.restaurant.name}</p>
                </div>
                <div className="order-status" style={{ color: getStatusColor(order.orderStatus) }}>
                  {order.orderStatus}
                </div>
              </div>
              
              <div className="order-details">
                <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                <p><strong>Total:</strong> Rs.{order.totalPrice.toFixed(2)}</p>
                <p><strong>Delivery Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
              </div>
              
              <div className="order-items">
                <h4>Items:</h4>
                {order.orderItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.fooditem.image} alt={item.fooditem.name} />
                    <div>
                      <p>{item.fooditem.name} x {item.quantity}</p>
                      <p>Rs.{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {order.orderStatus === 'Processing' && (
                <button 
                  className="cancel-order-btn"
                  onClick={() => handleCancelOrder(order._id)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orderscreen;
