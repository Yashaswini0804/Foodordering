const mongoose = require('mongoose');

async function fixDatabase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/food-ordering');
        console.log('Connected to MongoDB');

        // Update restaurants to add isActive field
        const restaurantResult = await mongoose.connection.db.collection('restaurants').updateMany(
            { isActive: { $exists: false } },
            { $set: { isActive: true } }
        );
        console.log(`Updated ${restaurantResult.modifiedCount} restaurants with isActive: true`);

        // Update food items to add isAvailable field
        const foodItemResult = await mongoose.connection.db.collection('fooditems').updateMany(
            { isAvailable: { $exists: false } },
            { $set: { isAvailable: true } }
        );
        console.log(`Updated ${foodItemResult.modifiedCount} food items with isAvailable: true`);

        // Check if restaurants have cuisine as array
        const restaurants = await mongoose.connection.db.collection('restaurants').find({}).toArray();
        for (const restaurant of restaurants) {
            if (typeof restaurant.cuisine === 'string') {
                await mongoose.connection.db.collection('restaurants').updateOne(
                    { _id: restaurant._id },
                    { $set: { cuisine: [restaurant.cuisine] } }
                );
                console.log(`Fixed cuisine for ${restaurant.name}`);
            }
        }

        console.log('Database fix completed!');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error fixing database:', error);
        mongoose.disconnect();
    }
}

fixDatabase();
