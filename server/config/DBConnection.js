const mongoose = require('mongoose')

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.DB_URI)
    } catch(err){
        console.error(`error connect to DB ${err}`);
    }
}

module.exports = connectDB