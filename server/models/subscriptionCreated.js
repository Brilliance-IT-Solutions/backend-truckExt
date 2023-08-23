const mongoose = require("mongoose")
const Schema = mongoose.Schema

const subscriptionCreated = new Schema({
    id: {
        type: String
    },
    collection_method: {
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
})
const SubscriptionCreated = mongoose.model("SubscriptionCreated", subscriptionCreated)
module.exports = SubscriptionCreated