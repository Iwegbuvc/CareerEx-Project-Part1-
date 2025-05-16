const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {type: String, require: true},
    lastName: {type: String, require: true},
    email: {type: String, require: true},
    role: {type: String, enum: ["user", "agent"], default: "user", require: true},
    password: {type:String, requird: true}
}, {timestamps: true})

const User = new mongoose.model("User", userSchema)

module.exports = User