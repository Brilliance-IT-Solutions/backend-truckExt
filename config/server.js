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
const PaymentRoute = require("../server/routes/payment");
const StripeRoute = require("../server/routes/stripe");

const Subscription = require("../server/models/subscription");
const Checkout = require("../server/models/checkout");
const SubscriptionCreated = require("../server/models/subscriptionCreated");
const TransactionHistory = require("../server/models/transactionHistory");
const SubscriptionStatus = require("../server/models/subscriptionStatus");
const Customer = require("../server/models/customer");
const nodemailer = require("nodemailer");
var cron = require("node-cron");

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
app.use("/api", PaymentRoute);
app.use("/api/stripe", StripeRoute);

app.post("/webhook", async (req, res) => {
  const event = req.body;
  try {
  // Handle different event types
  switch (event.type) {
    case "customer.subscription.updated":
      // Handle subscription updates if needed
      console.log("customer.subscription.updated", event.type);
      console.log("customer.subscription.updated", event.data.object);
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
      console.log("Documents updated successfully");
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
    default:
    // console.log('Unhandled event type:', event.type);
    break;
  }
  return res.sendStatus(200); // Acknowledge receipt of the event
}
catch(error){
  console.log(error)
  return res.sendStatus(401); 
}
});

// const task = cron.schedule(
//   "25 18 * * *",
//   async () => {
//     console.log("running a task every minute on time 2 33");
//     // SubscriptionStatus.updateOne(filter,update).then(()=>{
//     //     res.json({
//     //         success: "Your email is successfully verified"
//     //     })
//     // })

//     try {
//       // Fetch matching documents from the sourceCollection
//       const sourceDocuments = await SubscriptionUpdated.find({
//         customer: "cus_OQmBkuLXvCAQLa",
//       });
//       // Update documents in the targetCollection based on sourceDocuments
//       for (const sourceDoc of sourceDocuments) {
//         let data = {
//           status: sourceDoc.status,
//           created: sourceDoc.created,
//           current_period_end: sourceDoc.current_period_end,
//           current_period_start: sourceDoc.current_period_start,
//         };
//         await SubscriptionStatus.updateOne(
//           { customer: "cus_OQmBkuLXvCAQLa" },
//           { $set: data }
//         );
//         console.log("Documents updated successfully");
//       }
//     } catch (err) {
//       console.error("Error updating documents:", err);
//     }
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Kolkata",
//   }
// );

// task.start();

const server = app.listen(port, () =>
  console.log(`Express server listening on port ${port}`)
);
server.timeout = 50000;


app.use(errorMiddleware)
