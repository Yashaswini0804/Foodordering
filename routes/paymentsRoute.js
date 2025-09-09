const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');

router.post('/processpayment', async (req, res) => {
    try {
        const {
            userid,
            amount,
            paymentType,
            cardNumber,
            phoneNumber,
        } = req.body;

        if (!userid || !amount || !paymentType) {
            return res.status(400).json({
                message: 'Missing required fields',
                required: ['userid', 'amount', 'paymentType']
            });
        }

        const newPayment = new Payment({
            userid,
            amount,
            paymentType,
            cardNumber: paymentType === 'card' ? cardNumber : undefined,
            phoneNumber: paymentType === 'phone' ? phoneNumber : undefined,
            status: 'completed'
        });

        const payment = await newPayment.save();

        res.status(200).json({
            message: 'Payment processed successfully',
            payment: payment
        });

    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(400).json({
            message: error.message,
            error: error
        });
    }
});

router.get('/getallpayments', async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
