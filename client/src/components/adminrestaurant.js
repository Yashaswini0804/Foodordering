import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './Loader';
import Error from './Error';

export function Restaurants() {
    const [restaurants, setrestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        cuisine: [],
        deliveryTime: '',
        deliveryFee: 0,
    });

    useEffect(() => {
        const fetchrestaurants = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/restaurants/getallrestaurants');
                setrestaurants(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
                setError(error);
            }
        };

        fetchrestaurants();
    }, []);

    const handleEdit = (item) => {
        setEditingItem(item._id);
        setEditForm({
            name: item.name,
            description: item.description,
            address: item.address,
            phone: item.phone,
            email: item.email,
            cuisine: item.cuisine || [],
            deliveryTime: item.deliveryTime,
            deliveryFee: item.deliveryFee || 0,
        });
    };

    const handleSaveEdit = async () => {
        try {
            await axios.put('/api/restaurants/updaterestaurant', {
                restaurantid: editingItem,
                ...editForm
            });
            alert('Restaurant updated successfully!');
            setEditingItem(null);
            // Refresh the list
            const response = await axios.get('/api/restaurants/getallrestaurants');
            setrestaurants(response.data);
        } catch (error) {
            console.log(error);
            alert('Error updating restaurant');
        }
    };

    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this restaurant?')) {
            try {
                await axios.delete('/api/restaurants/deleterestaurant', {
                    data: { restaurantid: itemId }
                });
                alert('Restaurant deleted successfully!');
                // Refresh the list
                const response = await axios.get('/api/restaurants/getallrestaurants');
                setrestaurants(response.data);
            } catch (error) {
                console.log(error);
                alert('Error deleting restaurant');
            }
        }
    };

    return (
        <div className='row'>
            <div className='col-md-11'>
                <h1>Restaurants</h1>
                {loading && <Loader />}
                {error && <Error message="Error fetching restaurants" />}
                <table className='table table-bordered table-dark'>
                    <thead className='bs '>
                        <tr>
                            <th>RestaurantId</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Address</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants && restaurants.map(restaurant => (
                            <tr key={restaurant._id}>
                                <td>{restaurant._id}</td>
                                {editingItem === restaurant._id ? (
                                    <>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <textarea
                                                className="form-control"
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editForm.address}
                                                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editForm.phone}
                                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={editForm.email}
                                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <button className="btn btn-success btn-sm me-2" onClick={handleSaveEdit}>
                                                Save
                                            </button>
                                            <button className="btn btn-secondary btn-sm" onClick={() => setEditingItem(null)}>
                                                Cancel
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{restaurant.name}</td>
                                        <td>{restaurant.description}</td>
                                        <td>{restaurant.address}</td>
                                        <td>{restaurant.phone}</td>
                                        <td>{restaurant.email}</td>
                                        <td>
                                            <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(restaurant)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(restaurant._id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export function AddRestaurant() {
    const [restaurantForm, setRestaurantForm] = useState({
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        cuisine: [],
        deliveryTime: '',
        deliveryFee: 0,
        image: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/restaurants/addrestaurant', restaurantForm);
            alert('Restaurant added successfully!');
            setRestaurantForm({
                name: '',
                description: '',
                address: '',
                phone: '',
                email: '',
                cuisine: [],
                deliveryTime: '',
                deliveryFee: 0,
                image: '',
            });
        } catch (error) {
            console.log(error);
            setError(error);
            alert('Error adding restaurant');
        }
        setLoading(false);
    };

    return (
        <div className='row'>
            <div className='col-md-11'>
                <h1>Add Restaurant</h1>
                {error && <Error message="Error" />}
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={restaurantForm.name}
                                    onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    value={restaurantForm.description}
                                    onChange={(e) => setRestaurantForm({ ...restaurantForm, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={restaurantForm.address}
                                    onChange={(e) => setRestaurantForm({ ...restaurantForm, address: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={restaurantForm.phone}
                                    onChange={(e) => setRestaurantForm({ ...restaurantForm, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={restaurantForm.email}
                                    onChange={(e) => setRestaurantForm({ ...restaurantForm, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Cuisine (comma-separated)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={restaurantForm.cuisine.join(', ')}
                                    onChange={(e) => setRestaurantForm({ ...restaurantForm, cuisine: e.target.value.split(',').map(c => c.trim()) })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Delivery Time</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={restaurantForm.deliveryTime}
                                    onChange={(e) => setRestaurantForm({ ...restaurantForm, deliveryTime: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Delivery Fee</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={restaurantForm.deliveryFee}
                                    onChange={(e) => setRestaurantForm({ ...restaurantForm, deliveryFee: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Image URL</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={restaurantForm.image}
                                    onChange={(e) => setRestaurantForm({ ...restaurantForm, image: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Restaurant'}
                    </button>
                </form>
            </div>
        </div>
    )
}
