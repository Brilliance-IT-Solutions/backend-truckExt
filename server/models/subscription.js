const mongoose = require("mongoose")
const Schema = mongoose.Schema
//payment succeed
const subscriptionSchema = new Schema({

    id: {
        type: String
    },
    object: {
        type: String
    },
    amount: {
        type: Number
    },
    amount_capturable: {
        type: Number
    },
    amount_details: {
        type: {
            tip: Object
        }
    },
    amount_received: {
        type: Number
    },
    application: {
        type: Object
    },
    application_fee_amount: {
        type: Object
    },
    automatic_payment_methods: {
        type: Object
    },
    canceled_at: {
        type: Object
    },
    cancellation_reason: {
        type: Object
    },
    capture_method: {
        type: String
    },
    client_secret: {
        type: String
    },
    confirmation_method: {
        type: String
    },
    created: {
        type: Number
    },
    currency: {
        type: String
    },
    customer: {
        type: String
    },
    description: {
        type: String
    },
    invoice: {
        type: String
    },
    last_payment_error: {
        type: Object
    },
    latest_charge: {
        type: String
    },
    livemode: {
        type: Boolean
    },
    metadata: {
        type: Object
    },
    next_action: {
        type: Object
    },
    on_behalf_of: {
        type: Object
    },
    payment_method: {
        type: String
    },
    payment_method_options: {
        card: {
            installments: {
                type: Object
            },
            mandate_options: [Object],
            network: {
                type: Object
            },
            request_three_d_secure: {
                type: String
            },
            setup_future_usage: {
                type: String
            },
        }
    },
    payment_method_types: {
        type: Array
    },
    processing: {
        type: Object
    },
    receipt_email: {
        type: Object
    },
    review: {
        type: Object
    },
    setup_future_usage: {
        type: String
    },
    shipping: {
        type: Object
    },
    source: {
        type: Object
    },
    statement_descriptor: {
        type: Object
    },
    statement_descriptor_suffix: {
        type: Object
    },
    status: {
        type: String
    },
    transfer_data: {
        type: Object
    },
    transfer_group: {
        type: Object
    },


}, { timestamps: true })

const Subscription = mongoose.model("Subscription", subscriptionSchema)
module.exports = Subscription