const express = require('express')
const router = express.Router()

const PaymentController = require("../controllers/paymentcontrollers")

router.post('/payment', PaymentController.payment)
router.post('/createPaymentLink', PaymentController.createPaymentLink)
router.post('/create_subscription', PaymentController.createSubscription)
router.post('/un_subscription', PaymentController.UnSubscription)
router.post('/retrieve_subscription', PaymentController.retrieveSubscription)
router.post('/create_customer', PaymentController.createCustomer)
router.post('/create_checkout_session', PaymentController.createCheckoutSession)
router.get('/check', PaymentController.subscriptions)
router.post('/transaction', PaymentController.balanceTransactions)
router.post('/detail', PaymentController.DetailById)
router.post('/create_checkout_session1', PaymentController.createCheckout1)

module.exports = router