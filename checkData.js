const mongoose = require('mongoose');
const FoodItem = require('./models/fooditem');
const Restaurant = require('./models/restaurant');

async function checkData() {
    try {
        await mongoose.connect('mongodb://localhost:27017/food-ordering');
        
        console.log('=== FOOD ITEMS ===');
        const foodItems = await FoodItem.find({}).populate('restaurant');
        console.log('Total food items:', foodItems.length);
        foodItems.forEach(item => {
            console.log(`- ${item.name} - ${item.restaurant?.name || 'No restaurant linked'} - Available: ${item.isAvailable}`);
        });
        
        console.log('=== RESTAURANTS ===');
        const restaurants = await Restaurant.find({});
        console.log('Total restaurants:', restaurants.length);
        restaurants.forEach(r => console.log(`- ${r.name} - ${r._id}`));
        
        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkData();
