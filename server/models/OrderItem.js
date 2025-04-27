const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('OrderItem', OrderItemSchema);