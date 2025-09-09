const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Place new order
router.post('/placeorder', async (req, res) => {
    try {
        const neworder = new Order(req.body);
        await neworder.save();
        res.send('Order Placed Successfully');
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Get orders by user id
router.post('/getordersbyuserid', async (req, res) => {
    const userid = req.body.userid;
    try {
        const orders = await Order.find({ user: userid })
            .populate('restaurant', 'name')
            .populate('orderItems.fooditem', 'name image')
            .sort({ createdAt: -1 });
        res.send(orders);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Get all orders (admin)
router.get('/getallorders', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('restaurant', 'name')
            .populate('user', 'name email')
            .populate('orderItems.fooditem', 'name image')
            .sort({ createdAt: -1 });
        res.send(orders);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Get order by id
router.post('/getorderbyid', async (req, res) => {
    const orderid = req.body.orderid;
    try {
        const order = await Order.findOne({ _id: orderid })
            .populate('restaurant')
            .populate('user', 'name email')
            .populate('orderItems.fooditem');
        res.send(order);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Update order status
router.put('/updateorderstatus', async (req, res) => {
    const { orderid, status } = req.body;
    try {
        const order = await Order.findByIdAndUpdate(
            orderid,
            { orderStatus: status },
            { new: true }
        );
        // Emit event or notify user here if using websockets or push notifications
        res.send('Order Status Updated Successfully');
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Cancel order
router.put('/cancelorder', async (req, res) => {
    const { orderid } = req.body;
    try {
        const order = await Order.findByIdAndUpdate(
            orderid,
            { orderStatus: 'Cancelled' },
            { new: true }
        );
        res.send('Order Cancelled Successfully');
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Get orders by restaurant
router.post('/getordersbyrestaurant', async (req, res) => {
    const restaurantid = req.body.restaurantid;
    try {
        const orders = await Order.find({ restaurant: restaurantid })
            .populate('user', 'name email')
            .populate('orderItems.fooditem', 'name image')
            .sort({ createdAt: -1 });
        res.send(orders);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

module.exports = router;
