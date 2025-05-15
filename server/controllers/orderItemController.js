const mongoose = require('mongoose');
const OrderItem = require('../models/OrderItem');
const Order = require('../models/Order');
const Item = require('../models/Item');

const getAllOrderItems = async (req, res) => {
    try {
        const orderItems = await OrderItem.find().populate('order').populate('item');
        res.json(orderItems);
    } catch (error) {
        console.error('Error fetching order items:', error);
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
    const { order, item, quantity } = req.body;
    if (!order || !item || !quantity) {
        return res.status(400).json({ message: 'Order, item, and quantity are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(order)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(item)) {
        return res.status(400).json({ message: 'Invalid item ID' });
    }
    if( typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be a positive number' });
    }
    try {
        const duplicate = await OrderItem.findOne({order, item});
        if (duplicate) {
            return res.status(409).json({ message: 'Order item already exists' });
        }
        const orderExists = await Order.findById(order);
        if (!orderExists) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const itemExists = await Item.findById(item);
        if (!itemExists) {
            return res.status(404).json({ message: 'Item not found' });
        }
        
        const orderItem = OrderItem.create({ order, item, quantity });
        if (orderItem) {
            return res.status(201).json({ message: `New order item created with ID ${orderItem._id}` });
        }else {
            return res.status(400).json({ message: 'Invalid order item' });
        }
    }catch (error) {
        console.error('Error adding order item:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const updateOrderItem = async (req, res) => {
    const { id, order, item, quantity } = req.body;
    if (!id || !order || !item || !quantity) {
        return res.status(400).json({ message: 'Order, item, and quantity are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid order item ID' });
    }
    try {
        const orderItem = await OrderItem.findById(id);
        if (!orderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }
    } catch (error) {
        console.error('Error fetching order item:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(order)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(item)) {
        return res.status(400).json({ message: 'Invalid item ID' });
    }
    if( typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be a positive number' });
    }
    try {
        const orderExists = await Order.findById(order);
        if (!orderExists) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const itemExists = await Item.findById(item);
        if (!itemExists) {
            return res.status(404).json({ message: 'Item not found' });
        }
        
        orderItem.order = order;
        orderItem.item = item;
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
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(400).json({ message: 'Invalid order item ID' });
    // }
    try {
        const orderItem = await OrderItem.findById(id);
        // if (!orderItem) {
        //     return res.status(404).json({ message: 'Order item not found' });
        // }
        const result = await orderItem.deletOne()
        res.json(result)
    } catch (error) {
        console.error('Error deleting order item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getAllOrderItems,
    getOrderItemById,
    addOrderItem,
    updateOrderItem,
    deleteOrderItem
}