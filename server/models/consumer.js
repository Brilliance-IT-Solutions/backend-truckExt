const mongoose = require("mongoose")
const Schema = mongoose.Schema

const consumerSchema = new Schema({
    timer: {
        type: String
    },
    id: {
        type: String
    },
    units: {
        type: String
    },
    customer:{
        type:String
    },
    xpath:{
        type:String
    }
   

}, { timestamps: true })

const Consumer = mongoose.model("Consumer", consumerSchema)
module.exports = Consumer