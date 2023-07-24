const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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
        })
        user.save()
            .then(user => {
                res.json({
                    res: {
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        _id: user._id
                    },
                    message: "User Added Successfully"
                })
            })
            .catch(error => {
                res.json({
                    message: error || "An error Occured"
                })
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

                        res.json({
                            res: {
                                firstname: user.firstname,
                                lastname: user.lastname,
                                email: user.email,
                                _id: user._id
                            },
                            message: "Login Successful",
                            token: token,
                            // refreshToken: refreshToken
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


module.exports = {
    register, login
}