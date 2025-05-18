const express = require('express')
const router = express.Router()
const itemControllers = require('../controllers/itemController')
const { verifyJWTAdmin} = require('../middleware/verifyJWT')

router.get('/',itemControllers.getAllItems)
router.get('/:id',itemControllers.getItemById)
router.post('/',verifyJWTAdmin,itemControllers.addNewItem)
router.put('/', verifyJWTAdmin,itemControllers.updateItem)
router.delete('/:id', verifyJWTAdmin, itemControllers.deleteItem)

module.exports = router