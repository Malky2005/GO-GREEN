const mongoose = require('mongoose')

const ingredientSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    unit:{
        type:String,
        require:true
    },
    price:{
        type:Number
    }
}, {
    timestamps: true
}
)

module.exports = mongoose.model('Ingredient', ingredientSchema)