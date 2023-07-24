const express = require("express")
const router = express.Router()

const UserController = require('../controllers/usercontrollers')
router.post('/login', UserController.login)
router.post('/signup', UserController.register)

module.exports = router