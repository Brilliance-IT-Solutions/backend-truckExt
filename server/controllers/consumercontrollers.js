const Consumer = require("../models/consumer")

//Add new customer for setting
const store = (req, res, next) => {
    let consumer = new Consumer({
        timer: req.body.timer,
        id: req.body.id,
        units: req.body.units,
        customer : req.body.customer

    })
    consumer.save()
        .then(response => {
            res.json({
                message: "Consumer detailed stored Successfully"
            })
        }).catch(res => {
            res.json({
                message: "An error Occured"
            })
        })
}


const index = (req, res, next) => {
    Consumer.find()
        .then(response => {
            res.json({
                response
            })
        }).catch(error => {
            res.json({
                message: "An error Occured"
            })
        })
}



// //show single response of customer
const show = (req, res, next) => {
    let consumerId = req.body.customer
    Consumer.find({customer:consumerId})
        .then(response => {
            res.json({
                response
            })
        }).catch(error => {
            res.json({
                message: "An error Occured"
            })
        })
}

//update  customer setting 
const update = (req, res, next) => {
    let consumerId = req.body.customer
    let filter = {customer : consumerId}
    let updateData = {
        timer: req.body.timer,
        id: req.body.id,
        units: req.body.units,
        customer:req.body.customer
    }

    Consumer.updateOne(filter, { $set: updateData })
        .then((response) => {
            res.json({
                message: "Consumer updated Successfully"
            })
        }).catch(error => {
            res.json({
                message: "An error Occured"
            })
        })
}
module.exports = {
    store, index, update, show
}