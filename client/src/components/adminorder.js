import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './Loader';
import Error from './Error';

export function Orders() {
    const [orders, setorders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/orders/getallorders');
                setorders(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
                setError(error);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
    try {
        console.log('Updating order status:', orderId, newStatus);
        const updateResponse = await axios.put('/api/orders/updateorderstatus', { orderid: orderId, status: newStatus });
        console.log('Update response:', updateResponse.data);
        // Refresh orders
        const response = await axios.get('/api/orders/getallorders');
        setorders(response.data);
        console.log('Orders refreshed after status update');
        // Notify profile page or other components if needed (e.g., via event bus or state management)
    } catch (error) {
        console.log('Error updating order status:', error);
        setError(error);
    }
    };

    return (
        <div className='row'>
            <div className='col-md-11'>
                <h1>Orders</h1>
                {loading && <Loader />}
                {error && <Error message="Error fetching orders" />}
                <table className='table table-bordered table-dark'>
                    <thead className='bs '>
                        <tr>
                            <th>OrderId</th>
                            <th>User</th>
                            <th>Restaurant</th>
                            <th>Items</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length ? (
                            orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.user?.name || 'N/A'}</td>
                                    <td>{order.restaurant?.name || 'N/A'}</td>
                                    <td>
                                        {order.orderItems?.map(item => (
                                            <div key={item._id}>
                                                {item.fooditem?.name} x{item.quantity}
                                            </div>
                                        ))}
                                    </td>
                                    <td>Rs.{order.totalPrice}</td>
                                    <td>
                                        <select
                                            className="form-control"
                                            value={order.orderStatus}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Preparing">Preparing</option>
                                            <option value="Out for Delivery">Out for Delivery</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No orders available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
