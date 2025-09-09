import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RestaurantCard.css';

function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/restaurant/${restaurant._id}`);
  };

  return (
    <div className="restaurant-card" onClick={handleClick}>
      <img src={restaurant.imageurls[0]} alt={restaurant.name} />
      <div className="restaurant-info">
        <h3>{restaurant.name}</h3>
        <p className="cuisine">{restaurant.cuisine.join(', ')}</p>
        <div className="restaurant-details">
          <span className="rating">⭐ {restaurant.rating}</span>
          <span className="delivery-time">⏱️ {restaurant.deliveryTime}</span>
        </div>
        <p className="delivery-fee">Delivery Fee: Rs.{restaurant.deliveryFee}</p>
      </div>
    </div>
  );
}

export default RestaurantCard;
