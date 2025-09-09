const mongoose = require("mongoose");

const foodItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurants',
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    preparationTime: {
        type: Number,
        default: 20
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    ingredients: [{
        type: String
    }],
    tags: [{
        type: String
    }]
}, {
    timestamps: true
});

const foodItemModel = mongoose.model('fooditems', foodItemSchema);
module.exports = foodItemModel;
