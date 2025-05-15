const mongoose = require('mongoose')

const ingredientSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        unique:true
    },
    unit:{
        type:String,
        require:true
    },
    price:{
        type:Number
    },
    quantityInStack: {
        type: Number, 
        required: true,
        default: 0
    },
    quantityMissing: {
        type: Number
    }
}, {
    timestamps: true
}
)

module.exports = mongoose.model('Ingredient', ingredientSchema)