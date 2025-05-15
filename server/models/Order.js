const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    deliveryAddress:{
        street: { type: String },
        city: { type: String },
        building: { type: Number }
    },
    deliveryPhoneNumber: {
        type: String
    },
    totalPrice: {
        type: Number
    },
    status:{
        type:String,
        enum:['InBascket','Ordered','Accepted','Delivered'],
        default:'InBascket',
        required:true
    },
    dateForDelivery:{
        type:Date
    }
},{
    timestamps:true
})
module.exports = mongoose.model('Order',OrderSchema)