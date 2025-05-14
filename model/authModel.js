const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    FirstName: {type: String, require: true},
    lastName: {type: String, require: true},
    email: {type: String, require: true },
    password: {type: String, require: true}

}, {timestamps: true})

const Users = new mongoose.model("Users", userSchema)

module.exports = Users