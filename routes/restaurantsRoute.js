const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');

// Get all restaurants
router.get('/getallrestaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isActive: true });
        res.send(restaurants);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Get restaurant by id
router.post('/getrestaurantbyid', async (req, res) => {
    const restaurantid = req.body.restaurantid;
    try {
        const restaurant = await Restaurant.findOne({ _id: restaurantid });
        res.send(restaurant);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Add new restaurant (admin)
router.post('/addrestaurant', async (req, res) => {
    try {
        const newrestaurant = new Restaurant(req.body);
        await newrestaurant.save();
        res.send('New Restaurant Added Successfully');
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Update restaurant
router.put('/updaterestaurant', async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(
            req.body.restaurantid,
            req.body,
            { new: true }
        );
        res.send(restaurant);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Delete restaurant
router.delete('/deleterestaurant', async (req, res) => {
    try {
        await Restaurant.findByIdAndDelete(req.body.restaurantid);
        res.send('Restaurant Deleted Successfully');
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Search restaurants
router.post('/searchrestaurants', async (req, res) => {
    try {
        const searchQuery = req.body.searchQuery;
        const restaurants = await Restaurant.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { cuisine: { $in: [new RegExp(searchQuery, 'i')] } }
            ]
        });
        res.send(restaurants);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

module.exports = router;
