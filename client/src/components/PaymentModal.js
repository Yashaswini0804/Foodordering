// PaymentModal.js
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

function PaymentModal({ show, handleClose, orderDetails, onSuccess }) {
    const [paymentType, setPaymentType] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [totalAmount] = useState(orderDetails.totalPrice);

    async function processpayment() {
        const currentUser = JSON.parse(localStorage.getItem('currentuser'));
        const paymentData = {
            userid: currentUser._id,
            amount: totalAmount,
            paymentType: paymentType,
            cardNumber: paymentType === 'card' ? cardNumber : undefined,
            phoneNumber: paymentType === 'phone' ? phoneNumber : undefined,
            status: 'completed'
        };

        try {
            const response = await axios.post('/api/payments/processpayment', paymentData);
            console.log('Payment Response:', response.data);

            const orderData = {
                ...orderDetails,
                paymentMethod: paymentType,
                paymentResult: {
                    id: response.data.payment._id,
                    status: 'completed'
                }
            };
            await axios.post('/api/orders/placeorder', orderData);

            alert('Payment and order successful!');
            handleClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error details:', error.response?.data || error.message);
            alert('Payment or order failed!');
        }
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <h5>Select Payment Method:</h5>
                    <select onChange={(e) => setPaymentType(e.target.value)}>
                        <option value="">Select Payment Method</option>
                        <option value="card">Card</option>
                        <option value="phone">Phone Pay</option>
                    </select>
                    <h5>Total Amount: {totalAmount}</h5>
                   
                    </div>
                    
                    {paymentType === 'card' && (
                          <div>
                        <>
                      
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Card Number"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                            />
                            <input
                                type="text"
                                 className="form-control"
                                placeholder="Expiry Date (MM/YY)"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                            />
                          
                        </>
                        </div>
                    )}
                    {paymentType === 'phone' && (
                        <div>
<input
    type="text"
    placeholder="Phone Number"
    value={phoneNumber}
    onChange={(e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10); 
        if (value.length === 0 || ['6', '7', '9'].includes(value[0])) {
            setPhoneNumber(value);
        } else {
            alert('Phone number must start with 6,or7, or 9');
        }
    }}
    maxLength="10" 
/>
                        </div>
                    )}
                
        
             </Modal.Body> 
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={processpayment}>Order Now</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PaymentModal;
