const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CustomerSchema = new Schema({
    id: {
        type: String
    },
    object: {
        type: String
    },
    address: {
        type: Object
    },
    balance: {
        type: Number
    },
    created: {
        type: Number
    },
    currency: {
        type: String
    },
    default_source: {
        type: String
    },
    delinquent: {
        type: Boolean
    },
    description: {
        type: String
    },
    discount: {
        type: String
    },
    email: {
        type: String,
    },
    invoice_prefix: {
        type: String
    },
    invoice_settings: {
        custom_fields: {
            type: String
        },
        default_payment_method: {
            type: String
        },
        footer: {
            type: String
        },
        rendering_options: {
            type: String
        },
    },
    livemode: {
        type: Boolean
    },
    metadata: {
        order_id: {
            type: String
        },
    },
    name: {
        type: String
    },
    next_invoice_sequence: {
        type: String
    },
    phone: {
        type: String
    },
    preferred_locales: {
        type: Array
    },
    shipping: {
        type: String
    },
    tax_exempt: {
        type: String
    },
    test_clock: {
        type: String
    },
}, { timestamps: true })

const Customer = mongoose.model("Customer", CustomerSchema)
module.exports = Customer