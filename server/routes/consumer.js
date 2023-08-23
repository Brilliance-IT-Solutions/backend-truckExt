const express = require('express')
const router = express.Router()

const ConsumerController = require("../controllers/consumercontrollers")
// const upload = require("../middlewares/upload")
// const authenticate = require("../middlewares/authenticate")

router.get('/', ConsumerController.index)
router.post('/show', ConsumerController.show)
router.post('/store', ConsumerController.store)
// router.post('/store', upload.single('avatar'), EmployeeController.store)

router.patch('/update', ConsumerController.update)
// router.delete('/delete', EmployeeController.destroy)

module.exports = router