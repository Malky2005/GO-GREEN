const mongoose = require('mongoose')
const Ingredient = require('../models/Ingredient')

const getAllIngredients = async (req, res) => {
    try {
        const allIngredients = await Ingredient.find().lean().sort({ name: 1 })
        res.json(allIngredients)
    } catch (error) {
        console.error('Error fetching ingredients:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const GetIngridientById = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Id is not valid' })
    }
    try {
        const ingredient = await Ingredient.findById(id).lean()
        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' })
        }
        res.json(ingredient)
    } catch (error) {
        console.error('Error fetching ingredient:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const createIngredient = async (req, res) => {
    const { name, unit, price, quantityInStack } = req.body
    if (!name || !unit) {
        return res.status(400).json({ message: 'Name and unit are required' })
    }
    if (price && (typeof price !== 'number' || price < 0)) {
        return res.status(400).json({ message: 'Price must be a non-negative number' })
    }
    if (quantityInStack && (typeof quantityInStack !== 'number' || quantityInStack < 0)) {
        return res.status(400).json({ message: 'Quantity in stack must be a non-negative number' })
    }
    try {
        const duplicate = await Ingredient.findOne({ name }).lean()
        if (duplicate) {
            return res.status(409).json({ message: 'Ingredient already exists' })
        }
        const newIngredient = await Ingredient.create({ name, unit, price, quantityInStack })
        if (newIngredient) {
            return res.status(201).json({ message: `New ingredient created: ${newIngredient.name}` })
        } else {
            return res.status(400).json({ message: 'Invalid ingredient data received' })
        }
    } catch (error) {
        console.error('Error creating ingredient:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const updateIngredient = async (req, res) => {
    const { id, name, unit, price, quantityInStack } = req.body
    if (!id || !name || !unit) {
        return res.status(400).json({ message: 'Id, name and unit are required' })
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Id is not valid' })
    }
    try {
        const ingredient = await Ingredient.findById(id)
        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' })
        }
        const duplicate = await Ingredient.findOne({ name }).lean()
        if (duplicate && duplicate._id !== id) {
            return res.status(409).json({ message: 'Ingredient name already exists' })
        }
        if (price && (typeof price !== 'number' || price < 0)) {
            return res.status(400).json({ message: 'Price must be a positive number' })
        }
        if (quantityInStack && (typeof quantityInStack !== 'number' || quantityInStack < 0)) {
            return res.status(400).json({ message: 'Quantity in stack must be a positive number' })
        }
        ingredient.name = name
        ingredient.unit = unit
        ingredient.price = price
        ingredient.quantityInStack = quantityInStack
        const updatedIngredient = await ingredient.save()
        res.json({ message: `Ingredient ${updatedIngredient.name} updated` })
    } catch (error) {
        console.error('Error updating ingredient:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const deleteIngredient = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: 'Id is required' })
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Id is not valid' })
    }
    try {
        const ingredient = await Ingredient.findById(id)
        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' })
        }
        const result = await ingredient.deleteOne()
        res.json({ message: `Ingredient ${result.name} with ID ${result._id} deleted` })
    }catch (error) {
        console.error('Error deleting ingredient:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = {
    getAllIngredients,
    GetIngridientById,
    createIngredient,
    updateIngredient,
    deleteIngredient
}