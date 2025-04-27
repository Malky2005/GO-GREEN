const mongoose = require('mongoose')

const StackSchema = new mongoose.Schema({
    ingredient: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Ingredient model
        ref: 'Ingredient',
        required: true
    },
    quantity: {
        type: Number, // Quantity of the ingredient in the stack
        required: true
    }
},{
    timestamps:true
})

module.exports = mongoose.model('IngridientInStack',StackSchema)