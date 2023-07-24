const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstname: {
        type: String,
        required: [true, "firstName cann't be empty"],
        minLength: [4, "firstname should contain atleast 4 character"],
    },
    lastname: {
        type: String,
        required: [true, "lastName cann't be empty"],
        minLength: [4, "lastName should contain atleast 4 character"],

    },
    email: {
        type: String,
        required: [true, "Email cann't be empty"],
        unique: true,
        validate: {
            validator: function (v) {
                return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(v);
            },
            message: "Please enter a valid email"
        },

    },
    password: {
        type: String,
        required: [true, "password cann't be empty"],
        validate: {
            validator: function (v) {
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(v);
            },
            message: "password must contain atleast one uppercase letter, one lower case letter, one digit, one special character and of minimum length 8"
        },
    }

}, { timestamps: true })

const User = mongoose.model("User", userSchema)
module.exports = User
//for login and registration we have to install  packages  bcryptjs jsonwebtoken