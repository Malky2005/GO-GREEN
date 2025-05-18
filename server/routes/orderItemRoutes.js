const express = require('express')
const router = express.Router()
const orderItemControllers = require('../controllers/orderItemController')
const { verifyJWTAdmin, verifyJWTUser, verifyJWTUserOfOrderItem } = require('../middleware/verifyJWT')

router.get('/', verifyJWTAdmin, orderItemControllers.getAllOrderItems)
router.get('/user', verifyJWTUser, orderItemControllers.getOrderItemsByUser)
router.get('/:id', verifyJWTUserOfOrderItem, orderItemControllers.getOrderItemById)
router.post('/', verifyJWTUser, orderItemControllers.addOrderItem)
router.put('/', verifyJWTUserOfOrderItem, orderItemControllers.updateOrderItem)
router.delete('/:id', verifyJWTUserOfOrderItem, orderItemControllers.deleteOrderItem)

module.exports = router