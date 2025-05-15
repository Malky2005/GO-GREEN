const express = require('express')
const router = express.Router()
const ingredientControllers = require('../controllers/ingredientController')
const { verifyJWTAdmin } = require('../middleware/verifyJWT')

router.get('/',verifyJWTAdmin, ingredientControllers.getAllIngredients)
router.get('/:id',verifyJWTAdmin, ingredientControllers.GetIngridientById)
router.post('/', verifyJWTAdmin, ingredientControllers.createIngredient)
router.put('/', verifyJWTAdmin, ingredientControllers.updateIngredient)
router.delete('/', verifyJWTAdmin, ingredientControllers.deleteIngredient)

router.put('/:id/buy', verifyJWTAdmin, ingredientControllers.BuyIngredient)

module.exports = router