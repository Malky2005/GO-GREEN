const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        building: { type: Number, required: true }
    },
    totalPrice: {
        type: Number,
        required: true
    }
},{
    timestamps:true
})
module.exports = mongoose.model('Order',OrderSchema)