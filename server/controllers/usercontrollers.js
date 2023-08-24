const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Customer = require("../models/customer")
const otpGenerator = require('otp-generator')
const dispatch_email = require('./emailcontroller')

let otp = ''
const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPass) => {  // will encrypt the password if error occur return error
        if (err) {
            res.json({
                error: err
            })
        }
        let user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPass,
            status:0,
            otp:'',
            otpverified : false
        })
        user.save()
            .then(user => {
                
                res.json({
                    res: {
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        _id: user._id,
                        status:0,
                        otp:'',
                        otpverified : false
                    },
                    message: "User Added Successfully"
                })
              
            })
            .catch(error => {
                if (error.code === 11000) {
                    // Handle duplicate key error
                    const errorMessage = "Email already exists.";
                    res.status(400).json({ error: errorMessage });
                } else {
                    // Handle other errors
                    res.status(500).json({ error: "An error occurred on the server." });
                }
            
            })
    })
}



const login = (req, res, next) => {
    var email = req.body.email
    var password = req.body.password

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }
                    if (result) {
                        let token = jwt.sign({ firstname: user.firstname }, 'AZQ,PI)0(', { expiresIn: '24hr' })
                        // let refreshToken = jwt.sign({ firstname: user.firstname }, 'refreshtokensecret', { expiresIn: '48h' }) // for refresh token
                        Customer.findOne({ email: user.email }).then((data) => {
                            if (data) {
                                res.json({
                                    res: {
                                        firstname: user.firstname,
                                        lastname: user.lastname,
                                        email: data.email || user.email,
                                        _id: user._id,
                                        customerId: data.id || '',
                                        subscriptionCreated: data.created || '',
                                        status:user.status,
                                        otp:user.otp,
                                        otpverified : user.otpverified
                                    },
                                    message: "Login Successful",
                                    token: token,
                                    // refreshToken: refreshToken
                                })
                            } else {
                                res.json({
                                    res: {
                                        firstname: user.firstname,
                                        lastname: user.lastname,
                                        email: user.email,
                                        _id: user._id,
                                        customerId: '',
                                        subscriptionCreated: '',
                                        status:user.status,
                                        otp:user.otp,
                                        otpverified: user.otpverified
                                    },
                                    message: "Login Successful",
                                    token: token,
                                    // refreshToken: refreshToken
                                })
                            }
                        })
                    } else {
                        res.json({
                            error: "Password doesn't matched"
                        })
                    }
                })
            } else {
                res.json({
                    error: "No user found"
                })
            }
        })
}

const sendotp = async(req,res)=>{
    try{
    email=req.body.email;
     otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });
    await dispatch_email(email,"Otp for registration is: ","<h3>OTP for account verification is </h3>", otp)
     res.json({
           success : 'otp sent successfully on your email'
        })
}
catch{
    res.json({
        error : 'Please try again'
     })
}

   
};

const verifyOtp = async (req,res)=>{
    let email = req.body.email
    if(req.body.otp===otp){
        const filter = { email: email}; // Specify the email to identify the user
      const update = {
        $set: {
          status: 1,
          otp: otp,
          otpverified: true
        }
      };

        User.updateOne(filter,update).then(async ()=>{
            res.json({
                success: "Your email is successfully verified"
            })
        await dispatch_email(email,'Account Registration Successful!','<h3>Attention!</h3><br><h3>Your Account has been successfully registered.</h3>', '')

        })
    }
    else{
        res.json({
            error: "OTP is incorrect"
        })
    }
}; 

   const checkVerified = (req,res)=>{
    let email = req.body.email
      User.find({email:email}).then(response => {
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
    register, login, sendotp, verifyOtp, checkVerified
}