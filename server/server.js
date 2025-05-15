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
app.use('/api/ingredients',require('./routes/ingridientRoutes'))

mongoose.connection.once('open', ()=>{
    console.log('connected to DB');
    app.listen(PORT, ()=>{
        console.log(`server running on port ${PORT}`);
    })
})

mongoose.connection.on('error', err=>{
    console.log(err);
})