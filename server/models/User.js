const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        requrired:true
    },
    lastname:{
        type:String,
        requrired:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        requrired:true
    },
    email:{
        type:String,
        lowercase:true,
        requrired:true
    },
    address:{
        street:String,
        city:String,
        building:Number
    },
    phone:{
        type:String,
        trim:true
    },
    role:{
        type:String,
        enum:['User', 'Admin'],
        default:"User",
    }
},{
    timestamps:true
})
module.exports = mongoose.model('User',userSchema)