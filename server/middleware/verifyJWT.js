const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const OrderItem = require('../models/OrderItem')

const verifyJWTUser = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) {
        console.log(authHeader);
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' })
        req.user = decoded
        next()
    })
}

const verifyJWTAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' })
        }
        if (decoded.role !== 'Admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }
        req.user = decoded
        next()
    })
}

const verifyJWTUserOfOrderItem = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) {
        console.log(authHeader);
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' })
        if (decoded.role === 'Admin') {
            next();
        }
        try {
            const{ id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid order item ID' });
            }
            const orderItem = await OrderItem.findById(id).populate('order');
            if (!orderItem) {
                return res.status(404).json({ message: 'OrderItem not found' });
            }
            const user = await User.findOne({username: decoded.username });
            if (orderItem.order.user.toString() !== user._id) {
                return res.status(403).json({ message: 'Forbidden: You do not own this order' });
            }

            req.user = decoded;
            next();
        } catch (error) {
            console.error('Error verifying user of order item:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    })
}

module.exports = {
    verifyJWTUser,
    verifyJWTAdmin,
    verifyJWTThisUser,
    verifyJWTUserOfOrderItem
}