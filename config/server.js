const express = require("express");
const bodyParser = require("body-parser");
const environmentVariables = require("../server/utils/environmentVariables");
const { authenticate, errorMiddleware } = require("../server/middlewares");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)
const app = express();
require("./database.js");
require("./cors.js")(app);
const AuthRoute = require('../server/routes/user')
const ConsumerRoute = require('../server/routes/consumer')
const PaymentRoute = require('../server/routes/payment')

const port = environmentVariables.PORT || 3000;
console.log("sssssss", environmentVariables.NODE_ENV);

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    next();
});

app.get("/", authenticate, (req, res, next) => res.send("SERVER RUNNING"));
app.use('/api', AuthRoute);
app.use('/api/consumer', ConsumerRoute);
app.use('/api', PaymentRoute);

app.post('/stripe_webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, 'whsec_e017c925c1b48ea2002762c72a89fd1c8727b5ff0a5b1bf2a34ac0af39d2c1ea');
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

        case 'customer.subscription.created':
            // Handle failed payment
            console.log('Customer Subcription Created:', event.data.object);
            break;
        case 'customer.subscription.deleted':
            // Handle failed payment
            console.log('Customer Subcription deleted:', event.data.object);
            break;
        case 'customer.subscription.paused':
            // Handle failed payment
            console.log('Customer Subcription paused:', event.data.object);
            break;
        case 'customer.subscription.updated':
            // Handle failed payment
            console.log('Customer Subcription updated:', event.data.object);
            break;
        case 'customer.subscription.resumed':
            // Handle failed payment
            console.log('Customer Subcription resumed:', event.data.object);
            break;
        case 'customer.created':
            // Handle failed payment
            console.log('Customer created:', event.data.object);
            break;
        case 'customer.deleted':
            // Handle failed payment
            console.log('Customer deleted:', event.data.object);
            break;
        case 'checkout.session.completed':
            // Handle failed payment
            console.log('checkout session completed:', event.data.object);
            break;
        case 'checkout.session.expired':
            // Handle failed payment
            console.log('checkout session expired:', event.data.object);
            break;
        // Add more cases for other event types as needed
        default:
            console.log('Unhandled event type:', event.type);
    }

    res.sendStatus(event.data.object);


});

const server = app.listen(port, () => console.log(`Express server listening on port ${port}`));
server.timeout = 50000;

app.use(errorMiddleware);

