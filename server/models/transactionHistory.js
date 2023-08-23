const mongoose = require("mongoose")
const Schema = mongoose.Schema
//SubscriptionStatus  for subscription created
const transactionHistory = new Schema({
    id: {
        type: String
    },
    created: {
        type: Number
    },
    currency: {
        type: String
    },
    current_period_end: {
        type: Number
    },
    current_period_start: {
        type: Number
    },
    customer: {
        type: String
    },
    status: {
        type: String
    },
    email :{
        type: String
    },
    paymentSucceed :{
        type: Boolean
    },
    paymentmessage :{
        type: String
    }
}, { timestamps: true })
const TransactionHistory = mongoose.model("transactionHistory", transactionHistory)
module.exports = TransactionHistory