const express = require("express");
const bodyParser = require("body-parser");
const environmentVariables = require("../server/utils/environmentVariables");
const { authenticate, errorMiddleware } = require("../server/middlewares");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
const app = express();
require("./database.js");
require("./cors.js")(app);
const AuthRoute = require("../server/routes/user");
const ConsumerRoute = require("../server/routes/consumer");
const StripeRoute = require("../server/routes/stripe");

const TransactionHistory = require("../server/models/transactionHistory");
const SubscriptionStatus = require("../server/models/subscriptionStatus");

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
app.use("/api", AuthRoute);
app.use("/api/consumer", ConsumerRoute);
app.use("/api/stripe", StripeRoute);

app.post("/webhook",{timeout:60000 } , async (req, res) => {
  const event = req.body;
  try {
  // Handle different event types
  switch (event.type) {
    case "customer.subscription.updated":
      // Handle subscription updates if needed
      // console.log("customer.subscription.updated", event.type);
      // console.log("customer.subscription.updated", event.data.object);
      let data = {
        status: event.data.object.status,
        created: event.data.object.created,
        current_period_end: event.data.object.current_period_end,
        current_period_start: event.data.object.current_period_start,
      };
      await SubscriptionStatus.updateOne(
        { customer: event.data.object.customer },
        {
          $set: data
        }
      );
      // console.log("Documents updated successfully");
      let subscriptionUpdated = new TransactionHistory({
        id: event.data.object.id,
        created: event.data.object.created,
        currency: event.data.object.currency,
        current_period_end: event.data.object.current_period_end,
        current_period_start: event.data.object.current_period_start,
        customer: event.data.object.customer,
        status: event.data.object.status,
        paymentSucceed:true,
        paymentmessage:"subscription updated successfully"
      });
      subscriptionUpdated.save();
      break;
      // case "invoice.payment_succeeded":
      //   // Handle subscription updates if needed
      //   console.log("invoice.payment_succeeded", event.type);
      //   console.log("invoice.payment_succeeded", event.data.object);
      //   break;
      // case "invoice.payment_failed":
      //   // Handle subscription updates if needed
      //   console.log("invoice.payment_failed", event.type);
      //   console.log("invoice.payment_failed", event.data.object);
      //   break;
    default:
    break;
  }
  return res.sendStatus(200); // Acknowledge receipt of the event
}
catch(error){
  console.log(error)
  return res.sendStatus(401); 
}
});

const server = app.listen(port, () =>
  console.log(`Express server listening on port ${port}`)
);
server.timeout = 50000;
app.use(errorMiddleware);
