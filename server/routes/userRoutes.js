const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/userController')
const { verifyJWTUser, verifyJWTAdmin } = require('../middleware/verifyJWT')

router.get('/', verifyJWTAdmin, userControllers.getAllUsers)
router.get('/user', verifyJWTUser, userControllers.getUser)
router.get('/:id', verifyJWTAdmin, userControllers.getUserById)
router.put('/', verifyJWTUser, userControllers.updateUser)
router.put('/update', verifyJWTAdmin, userControllers.updateUserById)
router.delete('/:id', verifyJWTAdmin, userControllers.deleteUser)

module.exports = router