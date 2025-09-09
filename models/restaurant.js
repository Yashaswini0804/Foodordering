const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cuisine: {
        type: [String],
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    deliveryTime: {
        type: String,
        required: true
    },
    deliveryFee: {
        type: Number,
        default: 0
    },
    imageurls: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    openingHours: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

const restaurantModel = mongoose.model('restaurants', restaurantSchema);
module.exports = restaurantModel;
