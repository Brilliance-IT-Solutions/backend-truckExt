const mongoose = require("mongoose")
const Schema = mongoose.Schema
//Checkout for checkout session completed
const CheckoutSchema = new Schema({

    id: {
        type: String
    },
    object: {
        type: String
    },
    after_expiration: {
        type: Object
    },
    allow_promotion_codes: {
        type: Boolean
    },
    amount_subtotal: {
        type: Number
    },
    amount_total: {
        type: Number
    },
    automatic_tax: {
        enabled: {
            type: Boolean
        }, status: {
            type: Object
        }
    },
    billing_address_collection: {
        type: String
    },
    cancel_url: {
        type: String
    },
    client_reference_id: {
        type: Object
    },
    consent: {
        type: Object
    },
    // consent_collection: {
    //     promotions: {
    //         type: String
    //     }, terms_of_service: {
    //         type: String
    //     }
    // },
    created: {
        type: Number
    },
    currency: {
        type: String
    },
    currency_conversion: {
        type: Object
    },
    custom_fields: {
        type: Array
    },
    custom_text: {
        shipping_address: {
            type: Object
        }, submit: {
            type: Object
        }
    },
    customer: {
        type: String
    },
    customer_creation: {
        type: String
    },
    customer_details: {
        address: [Object],
        email: {
            type: String
        },
        name: {
            type: String
        },
        phone: {
            type: String
        },
        tax_exempt: {
            type: String
        },
        tax_ids: []
    },
    customer_email: {
        type: Object
    },
    expires_at: {
        type: Number
    },
    invoice: {
        type: String
    },
    invoice_creation: {
        type: Object
    },
    livemode: {
        type: Boolean
    },
    locale: {
        type: String
    },
    metadata: {
        type: Object
    },
    mode: {
        type: String
    },
    payment_intent: {
        type: Object
    },
    payment_link: {
        type: String
    },
    payment_method_collection: {
        type: String
    },
    payment_method_options: {
        type: Object
    },
    payment_method_types: {
        type: Array
    },
    payment_status: {
        type: String
    },
    phone_number_collection: {
        enabled: {
            type: Boolean
        }
    },
    recovered_from: {
        type: Object
    },
    setup_intent: {
        type: Object
    },
    shipping_address_collection: {
        type: Object
    },
    shipping_cost: {
        type: Object
    },
    shipping_details: {
        type: Object
    },
    shipping_options: {
        type: Array
    },
    status: {
        type: String
    },
    submit_type: {
        type: String
    },
    subscription: {
        type: String
    },
    success_url: {
        type: String
    },
    total_details: {
        amount_discount: {
            type: Number
        }, amount_shipping: {
            type: Number
        }, amount_tax: {
            type: Number
        }
    },
    url: {
        type: Object
    }
}, { timestamps: true })

const Checkout = mongoose.model("Checkout", CheckoutSchema)
module.exports = Checkout