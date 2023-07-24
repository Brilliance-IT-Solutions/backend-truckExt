/* global chrome */
const dotenv = require("dotenv");

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
    try {
        const { name, email } = req.body;

        const customer = await stripe.customers.create({
            name: name,
            email: email,
        });
        res.json({
            data: customer,
            message: "cutomer created successfully",
        })
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
        console.log(customer)
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
        const subscription = await stripe.subscriptions.retrieve(
            req.body.subscriptionId
        );
        res.json({
            error: false,
            message: "subscription retrieved successfully",
            data: subscription
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: `${error.message}`,
            data: null,
        });
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
    const { customer } = req.body.customer
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




// Webhook endpoint to handle events from Stripe
const webHook = async (req, res) => {
    console.log(req.body)
    const payload = req.body;
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, 'whsec_e017c925c1b48ea2002762c72a89fd1c8727b5ff0a5b1bf2a34ac0af39d2c1ea');
        console.log(event)
    } catch (err) {
        console.error('Error verifying webhook signature:', err);
        return res.sendStatus(400);
    }

    // Handle specific event types
    switch (event.type) {
        case 'payment_intent.succeeded':
            // Process successful payment
            console.log('Payment succeeded:', event.data.object);
            break;
        case 'payment_intent.failed':
            // Handle failed payment
            console.log('Payment failed:', event.data.object);
            break;
        // Add more cases for other event types as needed
        default:
            console.log('Unhandled event type:', event.type);
    }

    res.sendStatus(event.data.object);


};


// server.js
// ... (previous code)





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
    // const Transactions = await stripe.customers.listBalanceTransactions(
    //     'cus_OIUc70fASEeyCr',
    //     { limit: 3 }
    // );
    // console.log(Transactions)

    const usageRecordSummaries = await stripe.subscriptionItems.listUsageRecordSummaries(
        "si_OIUdfFNNBKintR",
        { limit: 3 }
    );

    res.json({
        data: usageRecordSummaries
    })
}

module.exports = {
    payment, createSubscription, UnSubscription, retrieveSubscription, createPaymentLink, createCheckoutSession, subscriptions, webHook, createCustomer, balanceTransactions
}