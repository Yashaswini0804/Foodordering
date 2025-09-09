const mongoose = require('mongoose');
const FoodItem = require('./models/fooditem');
const Restaurant = require('./models/restaurant');

async function linkFoodItems() {
    try {
        await mongoose.connect('mongodb://localhost:27017/food-ordering');
        
        const restaurants = await Restaurant.find({});
        console.log('Found restaurants:', restaurants.length);
        
        // Link food items to restaurants
        const foodItems = await FoodItem.find({});
        console.log('Found food items:', foodItems.length);
        
        // Assign food items to restaurants in rotation
        for (let i = 0; i < foodItems.length; i++) {
            const restaurantIndex = i % restaurants.length;
            const restaurant = restaurants[restaurantIndex];
            
            await FoodItem.updateOne(
                { _id: foodItems[i]._id },
                { $set: { restaurant: restaurant._id } }
            );
            
            console.log(`Linked ${foodItems[i].name} to ${restaurant.name}`);
        }
        
        console.log('All food items linked successfully!');
        
        // Verify the linking
        const updatedItems = await FoodItem.find({}).populate('restaurant');
        updatedItems.forEach(item => {
            console.log(`${item.name} -> ${item.restaurant?.name}`);
        });
        
        mongoose.disconnect();
    } catch (error) {
        console.error('Error linking food items:', error);
    }
}

linkFoodItems();
