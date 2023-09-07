const mongoose = require("mongoose")
const Schema = mongoose.Schema
const subscriptionStatus = new Schema({
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
    email: {
        type: String
    },
}, { timestamps: true })
const SubscriptionStatus = mongoose.model("subscriptionStatus", subscriptionStatus)
module.exports = SubscriptionStatus