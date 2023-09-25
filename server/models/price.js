const mongoose = require("mongoose")
const Schema = mongoose.Schema
const retrievePrice = new Schema({
    id: {
        type: String
    },
    created: {
        type: Number
    },
    product:{
        type:String
    },
    currency: {
        type: String
    },
    interval:{
        type:String
    },
    unit_amount: {
        type: Number
    },
    currencySymbol:{
        type:String
    }
   
}, { timestamps: true })
const RetrievePrice = mongoose.model("retreivePrice", retrievePrice)
module.exports = RetrievePrice