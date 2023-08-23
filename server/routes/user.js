const express = require("express")
const router = express.Router()

const UserController = require('../controllers/usercontrollers')
router.post('/login', UserController.login)
router.post('/signup', UserController.register)
router.post('/sendotp', UserController.sendotp)
router.post('/verifyotp', UserController.verifyOtp)
router.post('/checkotp', UserController.checkVerified)

module.exports = router