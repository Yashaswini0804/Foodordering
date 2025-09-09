import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';
import SearchBar from '../components/SearchBar';
import './Homescreen.css';

function Homescreen() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('/api/restaurants/getallrestaurants');
      setRestaurants(response.data);
      setFilteredRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.cuisine.some(c => c.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredRestaurants(filtered);
  };

  return (
    <div className="homescreen">
      <div className="hero-section">
        <h1>Order Delicious Food Online</h1>
        <p>Discover amazing restaurants and get food delivered to your doorstep</p>
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <div className="restaurants-container">
        <h2>Popular Restaurants</h2>
        <div className="restaurants-grid">
          {filteredRestaurants.map(restaurant => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Homescreen;
