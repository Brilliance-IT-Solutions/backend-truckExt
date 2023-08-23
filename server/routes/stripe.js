const express = require('express')
const router = express.Router()

const StripeController = require("../controllers/stripecontroller")

router.post('/payment', StripeController.createPayment)
router.post('/checkSubscription', StripeController.checkSubscription)
router.post('/checkAfterFirstSubscription', StripeController.checkAfterFirstSubscription)

module.exports = router