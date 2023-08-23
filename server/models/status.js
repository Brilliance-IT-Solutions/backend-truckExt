const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userStatus = new Schema({
    customer: {
        type: String
    },
    status: {
        type: String
    },
}, { timestamps: true })
const UserStatus = mongoose.model("userStatus", userStatus)
module.exports = UserStatus