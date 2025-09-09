import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PaymentModal from '../components/PaymentModal';
import './Cartscreen.css';

function Cartscreen() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('currentuser')));
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  const updateQuantity = (foodItemId, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(foodItemId);
    } else {
      const updatedCart = cartItems.map(item =>
        item.fooditem._id === foodItemId
          ? { ...item, quantity: newQuantity }
          : item
      );
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const removeItem = (foodItemId) => {
    const updatedCart = cartItems.filter(item => item.fooditem._id !== foodItemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    const itemsTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = itemsTotal * 0.1; // 10% tax
    const shipping = 5; // Fixed shipping fee
    return {
      itemsTotal,
      tax,
      shipping,
      total: itemsTotal + tax + shipping
    };
  };



  if (cartItems.length === 0) {
    return (
      <div className="cartscreen">
        <h1>Your Cart is Empty</h1>
        <button onClick={() => navigate('/home')}>Browse Restaurants</button>
      </div>
    );
  }

  const totals = calculateTotal();

  return (
    <div className="cartscreen">
      <h1>Your Shopping Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.fooditem._id} className="cart-item">
              <img src={item.fooditem.image} alt={item.fooditem.name} />
              <div className="item-details">
                <h3>{item.fooditem.name}</h3>
                <p>Rs.{item.price.toFixed(2)}</p>
              </div>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.fooditem._id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.fooditem._id, item.quantity + 1)}>+</button>
              </div>
              <button onClick={() => removeItem(item.fooditem._id)}>Remove</button>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <span>Items Total:</span>
            <span>Rs.{totals.itemsTotal.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Tax:</span>
            <span>Rs.{totals.tax.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Delivery Fee:</span>
            <span>Rs.{totals.shipping.toFixed(2)}</span>
          </div>
          <div className="summary-item total">
            <span>Total:</span>
            <span>Rs.{totals.total.toFixed(2)}</span>
          </div>

          <div className="shipping-form">
            <h3>Shipping Details</h3>
            <input
              type="text"
              placeholder="Address"
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
            />
            <input
              type="text"
              placeholder="City"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={shippingAddress.postalCode}
              onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
            />
            <input
              type="text"
              placeholder="Phone"
              value={shippingAddress.phone}
              onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
            />
            <textarea
              placeholder="Special Instructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>

          {/* Removed old payment method select and place order button */}
          {/* <div className="payment-method">
            <h3>Payment Method</h3>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="Cash">Cash on Delivery</option>
              <option value="Card">Credit/Debit Card</option>
            </select>
          </div>

          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button> */}

          <button className="place-order-btn" onClick={() => {
            if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.phone) {
              alert('Please fill in all shipping details');
              return;
            }
            if (!cartItems[0]?.fooditem?.restaurant?._id) {
              alert('Restaurant info missing from cart item');
              return;
            }
            setShowPaymentModal(true);
          }}>
            Proceed to Payment
          </button>
          <PaymentModal
            show={showPaymentModal}
            handleClose={() => setShowPaymentModal(false)}
            orderDetails={{
              user: user._id,
              restaurant: cartItems[0].fooditem.restaurant._id,
              orderItems: cartItems.map(item => ({
                fooditem: item.fooditem._id,
                quantity: item.quantity,
                price: item.price
              })),
              shippingAddress,
              itemsPrice: totals.itemsTotal,
              taxPrice: totals.tax,
              shippingPrice: totals.shipping,
              totalPrice: totals.total,
              estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
              specialInstructions
            }}
            onSuccess={() => {
              localStorage.removeItem('cart');
              navigate('/orders');
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Cartscreen;
