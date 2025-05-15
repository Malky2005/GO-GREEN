const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const OrderItem = require('../models/OrderItem');
const Ingredient = require('../models/Ingredient');

const getAllOrders = async (req, res) => {
    try {
        const allOrders = await Order.find().lean()
        res.json(allOrders)
    } catch (error) {
        console.error('Error fetching orders:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const getOrderById = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Id is not valid' })
    }
    try {
        const order = await Order.findById(id).lean()
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        res.json(order)
    } catch (error) {
        console.error('Error fetching order:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const createOrder = async (req, res) => {
    const { user } = req.body
    if (!user) {
        return res.status(400).json({ message: 'User is required' })
    }
    if (!mongoose.Types.ObjectId.isValid(user)) {
        return res.status(400).json({ message: 'User id is not valid' })
    }
    try {
        const userExists = await User.findById(user)
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' })
        }
        const newOrder = new Order(req.body)
        await newOrder.save()
        res.status(201).json(newOrder)
    } catch (error) {
        console.error('Error creating order:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

// const updateOrder = async (req, res) => {
//     const { id } = req.params
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ message: 'Id is not valid' })
//     }
//     try {
//         const order = await Order.findById(id)
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' })
//         }
//         const { street, city, building, deliveryPhoneNumber, dateForDelivery, status } = req.body
//         if (!street || !city || !building || !deliveryPhoneNumber || !dateForDelivery) {
//             return res.status(400).json({ message: 'All fields are required' })
//         }
//         if (!['InBascket', 'Ordered', 'Accepted', 'Delivered'].includes(status)) {
//             return res.status(400).json({ message: 'Status is not valid' })
//         }
//         if (typeof building !== 'number' || building <= 0) {
//             return res.status(400).json({ message: 'Building must be a positive number' })
//         }
//         order.deliveryAddress = { street, city, building }
//         order.deliveryPhoneNumber = deliveryPhoneNumber
//         order.dateForDelivery = dateForDelivery
//         order.status = status
//         const orderItems = await OrderItem.find({ order: id })
//         if (!orderItems || orderItems.length === 0) {
//             return res.status(400).json({ message: 'Order items not found' })
//         }
//         const totalPrice = 0
//         orderItems.forEach(item => {
//             totalPrice += item.price * item.quantity
//         })
//         order.totalPrice = totalPrice
//         const updatedOrder = await Order.save()
//         res.json(updatedOrder)
//     } catch (error) {
//         console.error('Error updating order:', error)
//         return res.status(500).json({ message: 'Internal server error' })
//     }
// }

const deleteOrder = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Id is not valid' })
    }
    try {
        const order = await Order.findById(id)
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        const result = await item.deletOne()
        res.json(result)
    } catch (error) {
        console.error('Error deleting order:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const getOrdersByUserId = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Id is not valid' })
    }
    try {
        const orders = await Order.find({ user: id }).lean()
        if (!orders) {
            orders = []
        }
        res.json(orders)
    } catch (error) {
        console.error('Error fetching orders:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const getTotalPrice = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Id is not valid' })
    }
    try {
        const order = await Order.findById(id).lean()
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        const orderItems = await OrderItem.find({ order: id })
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'Order items not found' })
        }
        let totalPrice = 0
        orderItems.forEach(item => {
            totalPrice += item.price * item.quantity
        })
        res.json({ totalPrice })
    } catch (error) {
        console.error('Error fetching total price:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const orderOrder = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Id is not valid' })
    }
    try {
        const order = await Order.findById(id)
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        const { status } = order
        if (status !== 'InBascket') {
            return res.status(400).json({ message: 'Order is not in basket' })
        }
        const { street, city, building, deliveryPhoneNumber, dateForDelivery } = req.body
        if (!street || !city || !building || !deliveryPhoneNumber || !dateForDelivery) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        if (typeof building !== 'number' || building <= 0) {
            return res.status(400).json({ message: 'Building must be a positive number' })
        }
        order.deliveryAddress = { street, city, building }
        order.deliveryPhoneNumber = deliveryPhoneNumber
        order.dateForDelivery = dateForDelivery
        const orderItems = await OrderItem.find({ order: id })
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'Order items not found' })
        }
        const totalPrice = 0
        orderItems.forEach(item => {
            totalPrice += item.price * item.quantity
        })
        order.totalPrice = totalPrice
        order.status = 'Ordered'

        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } catch (error) {
        console.error('Error updating order status:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const acceptOrder = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Id is not valid' })
    }
    try {
        const order = await Order.findById(id)
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        const { status } = order
        if (status !== 'Ordered') {
            return res.status(400).json({ message: 'Order is not ordered' })
        }
        const orderItems = await OrderItem.find({ order: id }).populate('item');
        for (const orderItem of orderItems) {
            for (const ingredientInfo of orderItem.item.ingredients) {
                const ingredient = await Ingredient.findById(ingredientInfo.ingredient);
                if (!ingredient) {
                    return res.status(404).json({ message: `Ingredient not found for item ${item.name}` });
                }

                const requiredQuantity = ingredientInfo.quantity * orderItem.quantity;

                if (ingredient.quantityInStack >= requiredQuantity) {
                    ingredient.quantityInStack -= requiredQuantity;
                } else {
                    const missingQuantity = requiredQuantity - ingredient.quantityInStack;
                    ingredient.quantityInStack = 0;
                    ingredient.quantityMissing = (ingredient.quantityMissing || 0) + missingQuantity;
                }

                await ingredient.save();
            }
        }
        order.status = 'Accepted'
        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } catch (error) {
        console.error('Error updating order status:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

 const deliverOrder = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Id is not valid' })
    }
    try {
        const order = await Order.findById(id)
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        const { status } = order
        if (status !== 'Accepted') {
            return res.status(400).json({ message: 'Order is not accepted' })
        }
        order.status = 'Delivered'
        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } catch (error) {
        console.error('Error updating order status:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    // updateOrder,
    deleteOrder,
    getOrdersByUserId,
    getTotalPrice,
    orderOrder,
    acceptOrder,
    deliverOrder
}