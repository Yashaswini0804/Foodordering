import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profilescreen() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('currentuser'));
        if (userInfo) {
          setUser(userInfo);
          const response = await axios.post('/api/orders/getordersbyuserid', { userid: userInfo._id });
          setOrders(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentuser');
    window.location.href = '/login';
  };

  const handleRefresh = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('currentuser'));
      if (userInfo) {
        const response = await axios.post('/api/orders/getordersbyuserid', { userid: userInfo._id });
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error refreshing orders:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center mt-5">Please login to view your profile</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h2>User Profile</h2>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{user.name}</h5>
              <p className="card-text">Email: {user.email}</p>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <h2>Order History</h2>
          <button onClick={handleRefresh} className="btn btn-primary mb-3">Refresh Orders</button>
          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
                orders.map(order => (
              <div key={order._id} className="card mb-3">
                <div className="card-body">
                  <p className="card-text">Amount: Rs.{order.totalPrice}</p>
                  <p className="card-text">Status: {order.orderStatus}</p>
                  <p className="card-text">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Profilescreen;
