const mongoose = require('mongoose');
const OrderItem = require('../models/OrderItem');
const Order = require('../models/Order');
const Item = require('../models/Item');
const User = require('../models/User');

const getAllOrderItems = async (req, res) => {
    try {
        const orderItems = await OrderItem.find().populate('order').populate('item');
        res.json(orderItems);
    } catch (error) {
        console.error('Error fetching order items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getOrderItemsByUser = async (req, res) => {
    const { username } = req.user;
    try {
        const user = await User.findOne({ username });

        const orders = await Order.find({ user: user._id });

        const orderIds = orders.map(order => order._id); // רשימת ה-IDs של ההזמנות
        const orderItems = await OrderItem.find({ order: { $in: orderIds } })
            .populate('order')
            .populate('item').lean().sort({ createdAt: -1 });

        if (!orderItems) {
            return res.status(404).json({ message: 'No order items found for this user' });
        }
        res.json(orderItems);
    } catch (error) {
        console.error('Error fetching order items by user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getOrderItemById = async (req, res) => {
    const { id } = req.params;
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(400).json({ message: 'Invalid order item ID' });
    // }
    try {
        const orderItem = await OrderItem.findById(id).populate('order').populate('item');
        // if (!orderItem) {
        //     return res.status(404).json({ message: 'Order item not found' });
        // }
        res.json(orderItem);
    } catch (error) {
        console.error('Error fetching order item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const addOrderItem = async (req, res) => {
    const { item, quantity } = req.body;
    if (!item || !quantity) {
        return res.status(400).json({ message: 'item, and quantity are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(item)) {
        return res.status(400).json({ message: 'Invalid item ID' });
    }
    if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be a positive number' });
    }
    try {
        const user = await User.findOne({ username: req.user.username });

        let order = await Order.findOne({ status: 'InBascket', user: user._id });
        if (!order) {
            order = await Order.create({ user: user._id });
        }
        const duplicate = await OrderItem.findOne({ order: order._id, item });


        if (duplicate) {
            return res.status(409).json({ message: 'Order item already exists' });
        }
        const itemExists = await Item.findById(item);
        if (!itemExists) {
            return res.status(404).json({ message: 'Item not found' });
        }

        const orderItem = await OrderItem.create({ order: order._id, item, quantity });
        if (orderItem) {
            return res.status(201).json({ message: 'Order item created successfully', orderItem });
        } else {
            return res.status(400).json({ message: 'Invalid order item' });
        }
    } catch (error) {
        console.error('Error adding order item:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const updateOrderItem = async (req, res) => {
    const { id, quantity } = req.body;

    if (!id || !quantity) {
        return res.status(400).json({ message: 'all fields are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid order item ID' });
    }
    try {
        const orderItem = await OrderItem.findById(id);
        if (!orderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }
        const fullOrder = await Order.findById(orderItem.order);
        console.log(fullOrder);
        
        if (fullOrder.status !== 'InBascket') {
            return res.status(400).json({ message: 'Cannot update item that was orderd' });
        }
        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be a positive number' });
        }
        orderItem.quantity = quantity;

        const updatedOrderItem = await orderItem.save();
        res.json(updatedOrderItem);
    } catch (error) {
        console.error('Error updating order item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteOrderItem = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid order item ID' });
    }
    try {
        const orderItem = await OrderItem.findById(id);
        if (!orderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }
        const order = await Order.findById(orderItem.order);
        if (order.status !== 'InBascket') {
            return res.status(400).json({ message: 'Cannot delete item that was ordered' });
        }
        const result = await orderItem.deleteOne();
        res.json(result)
    } catch (error) {
        console.error('Error deleting order item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getAllOrderItems,
    getOrderItemsByUser,
    getOrderItemById,
    addOrderItem,
    updateOrderItem,
    deleteOrderItem
}