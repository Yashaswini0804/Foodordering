import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './Loader';
import Error from './Error';

export function FoodItems() {
    const [fooditems, setfooditems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        restaurant: '',
        preparationTime: 20,
    });

    useEffect(() => {
        const fetchfooditems = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/fooditems/getallfooditems');
                setfooditems(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
                setError(error);
            }
        };

        fetchfooditems();
    }, []);

    const handleEdit = (item) => {
        setEditingItem(item._id);
        setEditForm({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image,
            restaurant: item.restaurant?._id || item.restaurant,
            preparationTime: item.preparationTime || 20,
        });
    };

    const handleSaveEdit = async () => {
        try {
            await axios.put('/api/fooditems/updatefooditem', {
                fooditemid: editingItem,
                ...editForm
            });
            alert('Food item updated successfully!');
            setEditingItem(null);
            // Refresh the list
            const response = await axios.get('/api/fooditems/getallfooditems');
            setfooditems(response.data);
        } catch (error) {
            console.log(error);
            alert('Error updating food item');
        }
    };

    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this food item?')) {
            try {
                await axios.delete('/api/fooditems/deletefooditem', {
                    data: { fooditemid: itemId }
                });
                alert('Food item deleted successfully!');
                // Refresh the list
                const response = await axios.get('/api/fooditems/getallfooditems');
                setfooditems(response.data);
            } catch (error) {
                console.log(error);
                alert('Error deleting food item');
            }
        }
    };

    return (
        <div className='row'>
            <div className='col-md-11'>
                <h1>Food Items</h1>
                {loading && <Loader />}
                {error && <Error message="Error fetching food items" />}
                <table className='table table-bordered table-dark'>
                    <thead className='bs '>
                        <tr>
                            <th>FoodItemId</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Restaurant</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fooditems && fooditems.map(fooditem => (
                            <tr key={fooditem._id}>
                                <td>{fooditem._id}</td>
                                {editingItem === fooditem._id ? (
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
                                                type="number"
                                                className="form-control"
                                                value={editForm.price}
                                                onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editForm.category}
                                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                            />
                                        </td>
                                        <td>{fooditem.restaurant?.name || 'N/A'}</td>
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
                                        <td>{fooditem.name}</td>
                                        <td>{fooditem.description}</td>
                                        <td>Rs.{fooditem.price}</td>
                                        <td>{fooditem.category}</td>
                                        <td>{fooditem.restaurant?.name || 'N/A'}</td>
                                        <td>
                                            <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(fooditem)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(fooditem._id)}>
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

export function AddFoodItem() {
    const [foodItemForm, setFoodItemForm] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        restaurant: '',
        preparationTime: 20,
    });
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get('/api/restaurants/getallrestaurants');
                setRestaurants(response.data);
            } catch (error) {
                console.log(error);
                setError(error);
            }
        };
        fetchRestaurants();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/fooditems/addfooditem', foodItemForm);
            alert('Food item added successfully!');
            setFoodItemForm({
                name: '',
                description: '',
                price: 0,
                category: '',
                image: '',
                restaurant: '',
                preparationTime: 20,
            });
        } catch (error) {
            console.log(error);
            setError(error);
            alert('Error adding food item');
        }
        setLoading(false);
    };

    return (
        <div className='row'>
            <div className='col-md-11'>
                <h1>Add Food Item</h1>
                {error && <Error message="Error" />}
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={foodItemForm.name}
                                    onChange={(e) => setFoodItemForm({ ...foodItemForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    value={foodItemForm.description}
                                    onChange={(e) => setFoodItemForm({ ...foodItemForm, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Price</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={foodItemForm.price}
                                    onChange={(e) => setFoodItemForm({ ...foodItemForm, price: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={foodItemForm.category}
                                    onChange={(e) => setFoodItemForm({ ...foodItemForm, category: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Image URL</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={foodItemForm.image}
                                    onChange={(e) => setFoodItemForm({ ...foodItemForm, image: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Restaurant</label>
                                <select
                                    className="form-control"
                                    value={foodItemForm.restaurant}
                                    onChange={(e) => setFoodItemForm({ ...foodItemForm, restaurant: e.target.value })}
                                    required
                                >
                                    <option value="">Select Restaurant</option>
                                    {restaurants.map(restaurant => (
                                        <option key={restaurant._id} value={restaurant._id}>
                                            {restaurant.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Preparation Time (minutes)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={foodItemForm.preparationTime}
                                    onChange={(e) => setFoodItemForm({ ...foodItemForm, preparationTime: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Food Item'}
                    </button>
                </form>
            </div>
        </div>
    )
}
