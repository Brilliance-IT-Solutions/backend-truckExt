const Consumer = require("../models/consumer")

//Add new employeee
const store = (req, res, next) => {
    let consumer = new Consumer({
        timer: req.body.timer,
        id: req.body.id,
        units: req.body.units

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



// //show single response of employee
// const show = (req, res, next) => {
//     let consumerId = req.body._id

//     Consumer.findById(consumerId)
//         .then(response => {
//             res.json({
//                 response
//             })
//         }).catch(error => {
//             res.json({
//                 message: "An error Occured"
//             })
//         })
// }

//update  employeee
const update = (req, res, next) => {
    let consumerId = req.body._id
    let updateData = {
        timer: req.body.timer,
        id: req.body.id,
        units: req.body.units

    }

    Consumer.findByIdAndUpdate(consumerId, { $set: updateData })
        .then(() => {
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
    store, index, update
}