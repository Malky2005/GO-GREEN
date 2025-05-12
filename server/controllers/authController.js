const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = async (req,res)=>{
    const { username, password} = req.body
    if (!username || !password) {
        return res.status(400).json({message:'All fields are required'})
    }
    const foundUser = await User.findOne({username}).lean()
    if(!foundUser){
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const match = await bcrypt.compare(password, foundUser.password)
    if(!match){
        return res.status(401).json({message:'Unauthorized' })
    }
    const userInfo = {
        firstname:foundUser.firstname,
        lastname:foundUser.lastname,
        username:foundUser.username,
        email:foundUser.email,
        address:foundUser.address,
        phone:foundUser.phone,
        role:foundUser.role
    }
    const accessToken = jwt.sign(userInfo,process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken})
}

const register = async(req,res)=>{
    const { firstname, lastname, username, password, email, phone, street, city, building } = req.body
    if (building && (typeof building !== 'number' || building <= 0)) {
        return res.status(400).json({ message: 'building number must be a positive number' })
    }
    const address = {street,city,building:buildingNum}
    if(!firstname || !lastname || !username || !password || !email){
        return res.status(400).json({message:'All fields are required'})
    }
    const duplicate = await User.findOne({username}).lean()
    if(duplicate){
        return res.status(409).json({message:'username exists'})
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    
    const user = await User.create({firstname, lastname, username, password:hashedPwd, email, address, phone})
    if(user){
        return res.status(201).json({message:`new user created ${user.username} as ${user.role}`})
    } else{
        return res.status(400).json({message:'invalid user'})
    }
}
module.exports = {login, register}