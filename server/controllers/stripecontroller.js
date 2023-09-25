/* global chrome */
const dotenv = require("dotenv");
dotenv.config({ path: `.env.development` });
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);

const Customer = require("../models/customer");
const SubscriptionStatus = require("../models/subscriptionStatus");
const TransactionHistory = require("../models/transactionHistory");
var cron = require('node-cron');
const dispatch_email = require('./emailcontroller');
const RetrievePrice = require("../models/price");


const createPayment = async (req, res) => {
    const { tokenId, email } = req.body.data
    try {
        let customer = await stripe.customers.list({ email: email })

        if (customer.data.length === 0) {
         customer = await stripe.customers.create({
            source: tokenId,//created by the front end createToken()
            email: email,
            name: 'tes26',
            address: {
              line1: 'gill chowk',
              postal_code: '141003',
              city: 'Ludhiana',
              state: 'Punjab',
              country: 'India',
            },
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
    }
    else{
        customer = customer.data[0];
    }
       const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            off_session: true,
            items: [
                {
                    price: process.env.PRICE_ID
                },
            ]

        });
        let subscriptionDetail = new SubscriptionStatus({
            id: subscription.id,
            created: subscription.created,
            currency: subscription.currency,
            current_period_end: subscription.current_period_end,
            current_period_start: subscription.current_period_start,
            customer: subscription.customer,
            status: subscription.status,
            email : customer.email
        })
        subscriptionDetail.save()
        let subscriptionDetail1 = new TransactionHistory({
            id: subscription.id,
            created: subscription.created,
            currency: subscription.currency,
            current_period_end: subscription.current_period_end,
            current_period_start: subscription.current_period_start,
            customer: subscription.customer,
            email : email,
            status: subscription.status,
            paymentSucceed : true,
            paymentmessage:'You have successfully created subscription'
        })
        subscriptionDetail1.save();

        
        res.json({
            data: subscription,
            message: "subscription created successfully",
        })
        dispatch_email(email, 'Payment Succeed!', '<h3>Congratulations! '+email +  "!" + ' , </h3><p><h3>You can now now use truck extension </h3></p>', '')

    }
    catch(error) {
        dispatch_email(email, 'Payment failed!', '<h3>Payment Failed!' + email + ` </h3><h3>${error.raw.message}<p>Please try again after some time </p></h3>`, '')


        let errorMessage = "Payment failed. Please try again later.";

        // Handle specific error cases
        if (error.raw.type === "card_error") {
            switch (error.raw.code) {
                case "card_declined":
                    errorMessage = "Card declined. Please check your card details.";
                    break;
                case "incorrect_cvc":
                    errorMessage = "Incorrect CVC code. Please check your card details.";
                    break;
                case "expired_card":
                    errorMessage = "Card has expired. Please use a valid card.";
                    break;
                // Add more specific error cases as needed
                default :
                errorMessage = "Something went wrong. Please try again";

            }
        }

        res.status(400).json({
            message: errorMessage,
        });
        
        let subscriptionDetail1 = new TransactionHistory({
            paymentSucceed : false,
            paymentmessage: error.raw.message,
            email : email
        })
        subscriptionDetail1.save();
    }
}

const checkSubscription = (req, res, next) => {
    let customer = req.body.customer
    SubscriptionStatus.findOne({ customer: customer })
        .then(response => {
            res.json({
                response
            })
        }).catch(error => {
            res.json({
                message: "An error Occured"
            })
        })
}


const checkAfterFirstSubscription = (req, res, next) => {
    let email = req.body.email
    Customer.findOne({ email: email })
        .then(response => {
            res.json({
                response
            })
        }).catch(error => {
            res.json({
                message: "An error Occured"
            })
        })
}


const  checkReminder =  () =>{
    let currentDate2 = new Date();

    SubscriptionStatus.find().then((res)=>{
        res.forEach((ele)=>{
            let currentDate = new Date(ele.current_period_start * 1000)
            let currentDate1 = new Date(ele.current_period_start * 1000)
            currentDate.setDate(currentDate.getDate() + 1)
            const formattedDate = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
            const formatCurrentDate1 = currentDate1.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
            const formatCurrentDate2 = currentDate2.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
      
            if(formattedDate > formatCurrentDate2){
                // return
            }
            else{
                Customer.find({id:ele.customer}).then((customer)=>{
                    customer.forEach((customers)=>{
                        let subId= encodeURIComponent(ele.id)
                        // <a href=" https://f054-122-179-201-140.ngrok-free.app/api/stripe/perform-action?subId=${subId}">
                 dispatch_email(customers.email,  'Reminder Email!',  `<h3>Reminder Email!  ${customers.email}   </h3><h3><p>Counter Extension Subscription is going to expire on </p></h3> <p>Please Click on the button to re-subscribe and continue using Counter Extension<p><br><input type="button" value="Subscribe" style="color:#ffffff;background-color: #21AD22;border-color:#21AD22;padding: 15px;font-weight:700;border-radius: 10px;border:1px solid">`, formattedDate)
                    })
                })
            }
        })
    })
}

const task = cron.schedule('0 11 * * *', () => {
    console.log('running a task every day');
    checkReminder()
  },{
    scheduled: true,
    timezone: 'Asia/Kolkata'
  });

  task.start();

  const updateSubscription =  async (req, res, next) =>{
          res.json({
            message: "subscription updated successfully",
        })
  }


  const retrievedPrice = async (req,res)=>{
    try{
        RetrievePrice.find()
        .then(response => {
            res.json({
                data : response
            })
        }).catch(error => {
            res.json({
                message: "An error Occured"
            })
        })
      
    }
    catch(error){
        console.log(error)
    }
}

module.exports = {
    createPayment, checkSubscription, checkAfterFirstSubscription,updateSubscription,retrievedPrice
}