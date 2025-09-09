import React from 'react';
import './FoodItemCard.css';

function FoodItemCard({ foodItem, onAddToCart, onRemoveFromCart, cartQuantity }) {
  return (
    <div className="food-item-card">
      <img src={foodItem.image} alt={foodItem.name} />
      <div className="food-item-info">
        <h3>{foodItem.name}</h3>
        <p className="description">{foodItem.description}</p>
        <p className="price">Rs.{foodItem.price.toFixed(2)}</p>
        <p className="preparation-time">⏱️ {foodItem.preparationTime} min</p>
        
        <div className="cart-controls">
          {cartQuantity > 0 ? (
            <div className="quantity-controls">
              <button onClick={() => onRemoveFromCart(foodItem._id)}>-</button>
              <span>{cartQuantity}</span>
              <button onClick={() => onAddToCart(foodItem)}>+</button>
            </div>
          ) : (
            <button className="add-to-cart-btn" onClick={() => onAddToCart(foodItem)}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodItemCard;
