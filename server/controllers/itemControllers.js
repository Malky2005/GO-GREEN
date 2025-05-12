
const mongoose = require('mongoose')
const Ingredient = require('../models/Ingredient')
const Item = require('../models/Item')


const getAllItems = async (req, res) => {
    const allItems = await Item.find().lean().sort({ name: 1 })
    res.json(allItems)
}

const getItemById = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Id is not valid' })
    }
    const item = await Item.findById(id).lean()
    if (!item) {
        return res.status(400).json({ message: 'Item not found' })
    }
    res.json(item)
}

const addNewItem = async (req, res) => {
    const { name, details, category, size, price, ingredients, enoughFor } = req.body
    if (!name || !price) {
        return res.status(400).json({ message: 'fields are required' })
    }
    if (enoughFor && (typeof enoughFor !== 'number' || enoughFor <= 0)) {
        return res.status(400).json({ message: 'enoughFor must be a positive number' })
    }
    const validCategories = ['salad', 'goodies', 'fruit'];
    if (!validCategories.includes(category)) {
        return res.status(400).json({ message: `Invalid category. Valid categories are: ${validCategories.join(', ')}` });
    }
    const duplicateItem = await Item.findOne({ name, size })
    if (duplicateItem) {
        return res.status(409).json({ message: "duplicate name and size" })
    }
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        ing = []
    }else{
        ing = ingredients
    }

    for (const ingredient of ing) {
        const ingredientExists = await Ingredient.findById(ingredient.ingredient);
        if (!ingredientExists) {
            return res.status(404).json({ message: `Ingredient not found: ${ingredient.ingredient}` });
        }

        if (typeof ingredient?.quantity !== 'number' || ingredient?.quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be a positive number' })
        }
    }
    const item = await Item.create({name, details, category, size, price, ingredients})
    if (item) {
        return res.status(201).json({ message: `new item ${item.name} created` })
    } else {
        return res.status(400).send('invalid item')
    }
}

const updateItem = async (req, res) => {
    const {id, name, details, category, size, price, ingredients, enoughFor } = req.body
    if (!id || !name || !price) {
        return res.status(400).json({ message: 'fields are required' })
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Id is not valid' })
    }
    const item = await Item.findById(id)
    if (!item) {
        return res.status(400).json({ message: `no item found` })
    } 
    if (enoughFor && (typeof enoughFor !== 'number' || enoughFor <= 0)) {
        return res.status(400).json({ message: 'enoughFor must be a positive number' })
    }
    const validCategories = ['salad', 'goodies', 'fruit'];
    if (category && !validCategories.includes(category)) {
        return res.status(400).json({ message: `Invalid category. Valid categories are: ${validCategories.join(', ')}` });
    }
    const duplicateItem = await Item.findOne({ name, size })
    if (duplicateItem && duplicateItem._id != id) {
        return res.status(409).json({ message: "duplicate name and size" })
    }
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        ing = []
    }else{
        ing = ingredients
    }

    for (const ingredient of ing) {
        const ingredientExists = await Ingredient.findById(ingredient.ingredient);
        if (!ingredientExists) {
            return res.status(404).json({ message: `Ingredient not found: ${ingredient.ingredient}` });
        }

        if (typeof ingredient?.quantity !== 'number' || ingredient?.quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be a positive number' })
        }
    }
    
    item.name = name
    item.details = details
    item.category = category
    item.size = size
    item.price = price
    item.ingredients = ingredients
    item.enoughFor = enoughFor
    const updatedItem = await item.save()
    res.json(updatedItem)
}

const deletItem = async (req,res) => {
    const {id} = req.params
    if(!id){
        return res.status(400).send('id is requried')
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Id is not valid' })
    }
    const item = await Item.findById(id).lean()
    if (!item) {
        return res.status(400).json({ message: 'Item not found' })
    }
    const result = await item.deletOne()
    res.json(result)
}

module.exports = {
    getAllItems,
    getItemById,
    addNewItem,
    updateItem,
    deletItem
}