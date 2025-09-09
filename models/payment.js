
const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
   userid: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        required: true,
        enum: ['card', 'phone'] 
    },
    cardNumber: {
        type: String,
        required: function() { return this.paymentType === 'card'; }
    },
    phoneNumber: {
        type: String,
        required: function() { return this.paymentType === 'phone'; }
    },
    status: {
        type: String,
        required: true,
        default: 'completed'
    }
}, {
    timestamps: true
});

const paymentModel = mongoose.model('payment', paymentSchema);
module.exports = paymentModel;