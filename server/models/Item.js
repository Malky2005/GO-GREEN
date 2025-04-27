const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    details: {
        type: String
    },
    category: {
        type: String,
        enum: [salad, goodies, fruit]
    },
    size: {
        type: String
    },
    price: {
        type: Number,
        require: true
    },
    ingredients: {
        type: [
            {
                ingredient: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Ingredient',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }]
    }
}, {
    timestamps: true
})

itemSchema.index({ name: 1, size: 1 }, { unique: true })

module.exports = mongoose.model('Item', itemSchema)