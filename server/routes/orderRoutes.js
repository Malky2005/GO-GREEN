const express = require('express')
const router = express.Router()
const orderControllers = require('../controllers/orderController')
const { verifyJWTUser,verifyJWTAdmin,verifyJWTUserOfOrder } = require('../middleware/verifyJWT')

router.get('/',verifyJWTAdmin,orderControllers.getAllOrders)
router.get('/user',verifyJWTUser,orderControllers.getOrdersByUserId)
router.get('/:id',verifyJWTUserOfOrder,orderControllers.getOrderById)
router.post('/',verifyJWTUser,orderControllers.createOrder)
//router.put('/',verifyJWTAdmin,orderControllers.updateOrder)
router.delete('/:id',verifyJWTAdmin,orderControllers.deleteOrder)

router.get('/:id/total',verifyJWTUser,orderControllers.getTotalPrice)
router.put('/:id/status/order',verifyJWTUserOfOrder,orderControllers.orderOrder)
router.put('/:id/status/accept',verifyJWTAdmin,orderControllers.acceptOrder)
router.put('/:id/status/deliver',verifyJWTAdmin,orderControllers.deliverOrder)

module.exports = router