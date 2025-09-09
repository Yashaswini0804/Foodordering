import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FoodItemCard from '../components/FoodItemCard';
import './Restaurantscreen.css';

function Restaurantscreen() {
  const { restaurantid } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchRestaurantDetails();
    fetchFoodItems();
  }, [restaurantid]);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await axios.post('/api/restaurants/getrestaurantbyid', {
        restaurantid: restaurantid
      });
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    }
  };

  const fetchFoodItems = async () => {
    try {
      console.log('Fetching food items for restaurant ID:', restaurantid);
      const response = await axios.post('/api/fooditems/getfooditemsbyrestaurant', {
        restaurantid: restaurantid
      });
      console.log('Food items response:', response.data);
      console.log('Number of food items found:', response.data.length);
      setFoodItems(response.data);
    } catch (error) {
      console.error('Error fetching food items:', error);
      console.error('Error response:', error.response?.data);
    }
  };

  const addToCart = (foodItem) => {
    const existingItem = cart.find(item => item.fooditem._id === foodItem._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.fooditem._id === foodItem._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { fooditem: foodItem, quantity: 1, price: foodItem.price }]);
    }
  };

  const removeFromCart = (foodItemId) => {
    setCart(cart.filter(item => item.fooditem._id !== foodItemId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    // Navigate to cart screen
    navigate('/cart');
  };

  if (!restaurant) return <div>Loading...</div>;

  return (
    <div className="restaurantscreen">
      <div className="restaurant-header">
        <img src={restaurant.imageurls[0]} alt={restaurant.name} className="restaurant-image" />
        <div className="restaurant-info">
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <div className="restaurant-details">
            <span>⭐ {restaurant.rating}</span>
            <span>📍 {restaurant.address}</span>
            <span>⏱️ {restaurant.deliveryTime}</span>
            <span>💰 Delivery Fee: {restaurant.deliveryFee}</span>
          </div>
        </div>
      </div>

      <div className="menu-section">
        <h2>Menu</h2>
        <div className="food-items-grid">
          {foodItems.map(foodItem => (
            <FoodItemCard
              key={foodItem._id}
              foodItem={foodItem}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
              cartQuantity={cart.find(item => item.fooditem._id === foodItem._id)?.quantity || 0}
            />
          ))}
        </div>
      </div>

      <div className="cart-summary">
        <h3>Cart Summary</h3>
        <p>Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
        <p>Total Price: Rs.{getTotalPrice().toFixed(2)}</p>
        <button onClick={handleCheckout} disabled={cart.length === 0}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Restaurantscreen;
