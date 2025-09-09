const express = require('express');
const router = express.Router();
const FoodItem = require('../models/fooditem');

// Get all food items
router.get('/getallfooditems', async (req, res) => {
    try {
        const fooditems = await FoodItem.find({ isAvailable: true })
            .populate('restaurant', 'name');
        res.send(fooditems);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Get food items by restaurant
router.post('/getfooditemsbyrestaurant', async (req, res) => {
    const restaurantid = req.body.restaurantid;
    try {
        const fooditems = await FoodItem.find({ 
            restaurant: restaurantid, 
            isAvailable: true 
        }).populate('restaurant', 'name');
        res.send(fooditems);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Get food item by id
router.post('/getfooditembyid', async (req, res) => {
    const fooditemid = req.body.fooditemid;
    try {
        const fooditem = await FoodItem.findOne({ _id: fooditemid })
            .populate('restaurant');
        res.send(fooditem);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Add new food item (admin/restaurant)
router.post('/addfooditem', async (req, res) => {
    try {
        const newfooditem = new FoodItem(req.body);
        await newfooditem.save();
        res.send('New Food Item Added Successfully');
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Update food item
router.put('/updatefooditem', async (req, res) => {
    try {
        const fooditem = await FoodItem.findByIdAndUpdate(
            req.body.fooditemid,
            req.body,
            { new: true }
        );
        res.send(fooditem);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Delete food item
router.delete('/deletefooditem', async (req, res) => {
    try {
        await FoodItem.findByIdAndDelete(req.body.fooditemid);
        res.send('Food Item Deleted Successfully');
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Get food items by category
router.post('/getfooditemsbycategory', async (req, res) => {
    try {
        const category = req.body.category;
        const fooditems = await FoodItem.find({ 
            category: category, 
            isAvailable: true 
        }).populate('restaurant', 'name');
        res.send(fooditems);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

module.exports = router;
