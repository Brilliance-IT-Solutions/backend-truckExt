/* global chrome */
const dotenv = require("dotenv");
const Customer = require("../models/customer");
const Subscription = require("../models/subscription");

dotenv.config({ path: `.env.development` });
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)
const customerID = ''
const payment = async (req, res) => {
    let { amount, id } = req.body

    try {
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "USD",
            description: "Payment",
            payment_method: id,
            confirm: true
        })

        res.json({
            message: "Payment was successful",
            success: true,
        })
    } catch (error) {
        res.json({
            message: "Payment Failed",
            success: false
        })
    }
}

//create a customer for the subscription
const createCustomer = async (req, res) => {
    let customerId = ''
    try {
        const { name, email } = req.body;

        let customer = await stripe.customers.list({ email: email })

        if (customer.data.length === 0) {

            // If customer already exists, retrieve the existing customer
            customer = await stripe.customers.create({
                name: name,
                email: email,
            });
            let customerDetail = new Customer({
                id: customer.id,
                object: customer.object,
                address: customer.address,
                balance: customer.balance,
                created: customer.created,
                currency: customer.currency,
                default_source: customer.default_source,
                delinquent: customer.delinquent,
                description: customer.description,
                discount: customer.discount,
                email: customer.email,
                invoice_prefix: customer.invoice_prefix,
                invoice_settings: {
                    custom_fields: customer.invoice_settings.custom_fields,
                    default_payment_method: customer.invoice_settings.default_payment_method,
                    footer: customer.invoice_settings.footer,
                    rendering_options: customer.invoice_settings.rendering_options
                },
                livemode: customer.livemode,
                metadata: {
                    order_id: customer.metadata.order_id,
                },
                name: customer.name,
                next_invoice_sequence: customer.next_invoice_sequence,
                phone: customer.phone,
                preferred_locales: customer.preferred_locales,
                shipping: customer.shipping,
                tax_exempt: customer.tax_exempt,
                test_clock: customer.test_clock

            })
            customerDetail.save();
            res.json({
                data: customer,
                message: "cutomer created successfully",
            })
        } else {
            customer = customer.data[0];
        }
    }
    catch (error) {
        console.log(error)
    }
}


const createSubscription = async (req, res) => {
    try {
        const { name, email, paymentMethod, priceId } = req.body;

        const customer = await stripe.customers.create({
            name: name,
            email: email,
            payment_method: paymentMethod,
            invoice_settings: {
                default_payment_method: paymentMethod,
            },
        });
        //now create a subscription for that customer

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            payment_settings: {
                payment_method_options: {
                    card: {
                        request_three_d_secure: "any"
                    },
                },

                payment_method_types: ["card"],
                save_default_payment_method: "on_subscription",
            },
            expand: ["latest_invoice.payment_intent"]

        });
        res.json({
            error: false,
            message: "subscription created successfully",
            data: {
                clientSecret: subscription.latest_invoice.payment_intent.client_secret,
                subscriptionId: subscription.id,
            },
            // data: subscription
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: `${error.message}`,
            data: null,
        });
    }

}

const createCheckout1 = async (req, res) => {
    try {
        // Create a new customer
        const customer = await stripe.customers.create({
            email: req.body.email,
            name: req.body.name,// Replace with the customer's email address
            // Add any additional customer information as needed
        });
        let customerDetail = new Customer({
            id: customer.id,
            object: customer.object,
            address: customer.address,
            balance: customer.balance,
            created: customer.created,
            currency: customer.currency,
            default_source: customer.default_source,
            delinquent: customer.delinquent,
            description: customer.description,
            discount: customer.discount,
            email: customer.email,
            invoice_prefix: customer.invoice_prefix,
            invoice_settings: {
                custom_fields: customer.invoice_settings.custom_fields,
                default_payment_method: customer.invoice_settings.default_payment_method,
                footer: customer.invoice_settings.footer,
                rendering_options: customer.invoice_settings.rendering_options
            },
            livemode: customer.livemode,
            metadata: {
                order_id: customer.metadata.order_id,
            },
            name: customer.name,
            next_invoice_sequence: customer.next_invoice_sequence,
            phone: customer.phone,
            preferred_locales: customer.preferred_locales,
            shipping: customer.shipping,
            tax_exempt: customer.tax_exempt,
            test_clock: customer.test_clock

        })
        customerDetail.save();
        // Create a checkout session
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer: customer.id,
            line_items: [
                {
                    price: 'price_1NR9LfSC1ShPdNKckQWnVmgk', // Replace with the actual price ID for your subscription
                    quantity: 1,
                },
            ],
            success_url: 'https://example.com/success', // Replace with your success URL
            cancel_url: 'https://example.com/cancel', // Replace with your cancel URL
        });
        res.json({ sessionId: session.url, customerId: session.customer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const UnSubscription = async (req, res) => {
    try {
        const unsubscription = await stripe.subscriptions.cancel(
            req.body.subscriptionId
        );
        res.json({
            error: false,
            message: "unsubscription  successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: `${error.message}`,
            data: null,
        });
    }
}

const retrieveSubscription = async (req, res) => {
    try {
        const customer = await stripe.customers.retrieve(req.body.customerId, {
            expand: ['subscriptions'],
        });

        const subscriptionData = {
            hasActiveSubscription: customer.subscriptions.data.some(
                (subscription) => subscription.status === 'active'
            ),
            // Add more subscription data properties as needed
        };

        res.json({ subscriptionData });
    } catch (error) {
        console.error('Error retrieving customer subscriptions:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }

}


const createPaymentLink = async (req, res) => {
    const paymentLink = await stripe.paymentLinks.create({
        line_items: [
            {
                price: 'price_1NR9LfSC1ShPdNKckQWnVmgk',
                quantity: 1,
            },
        ],
    })
    res.json({
        data: paymentLink
    })
}

const createCheckoutSession = async (req, res) => {
    // const { customer } = req.body.customer
    const session = await stripe.checkout.sessions.create({
        line_items: [{
            price: 'price_1NR9LfSC1ShPdNKckQWnVmgk',
            quantity: 1,
        }],

        customer: customer,
        mode: 'subscription',
        success_url: 'http://localhost:3001/refresh',
        cancel_url: 'https://localhost:3001',
    });
    res.json({ id: session.id });

};

const subscriptions = async (req, res) => {
    const list = await stripe.subscriptions.list({
        limit: 3,
    });
    res.json({
        data: list
    })
}

const balanceTransactions = async (req, res) => {
    // console.log(req.body)
    const Transactions = await stripe.customers.listBalanceTransactions(
        'cus_OIUc70fASEeyCr',
        { limit: 3 }
    );
    console.log(Transactions)
}


//show single response of employee
const DetailById = (req, res, next) => {
    let customerId = req.body.customerId
    console.log(customerId)
    Subscription.findOne({ customer: customerId })
        .then(response => {
            console.log(response)
            res.json({
                response
            })
        }).catch(error => {
            res.json({
                message: "An error Occured"
            })
        })
}

module.exports = {
    payment, createSubscription, UnSubscription, retrieveSubscription, createPaymentLink, createCheckoutSession, subscriptions, createCustomer, balanceTransactions, DetailById, createCheckout1
}