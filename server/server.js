require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose= require('mongoose')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/DBConnection')

const app = express()
const PORT = process.env.PORT || 2244

connectDB()
app.use(cors(corsOptions))
app.use(express.json())

app.use('/api/auth',require('./routes/authRoutes'))
app.use('/api/items',require('./routes/itemRoutes'))
app.use('/api/ingredients',require('./routes/ingredientRoutes'))
app.use('/api/orders',require('./routes/orderRoutes'))
app.use('/api/orderItems',require('./routes/orderItemRoutes'))
app.use('/api/users',require('./routes/userRoutes'))

mongoose.connection.once('open', ()=>{
    console.log('connected to DB');
    app.listen(PORT, ()=>{
        console.log(`server running on port ${PORT}`);
    })
})

mongoose.connection.on('error', err=>{
    console.log(err);
})