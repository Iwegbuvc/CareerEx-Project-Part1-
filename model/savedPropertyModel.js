const mongoose = require("mongoose")

const savedProperty = new mongoose.Schema({
    user_id
}, {timestamps: true})

const saveProperty = new mongoose.model("saveProverty", savedProperty)

module.exports = saveProperty