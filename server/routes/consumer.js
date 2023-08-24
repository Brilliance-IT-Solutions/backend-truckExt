const express = require('express')
const router = express.Router()

const ConsumerController = require("../controllers/consumercontrollers")
router.get('/', ConsumerController.index)
router.post('/show', ConsumerController.show)
router.post('/store', ConsumerController.store)
router.patch('/update', ConsumerController.update)

module.exports = router