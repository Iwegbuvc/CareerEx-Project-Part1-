const mongoose = require("mongoose")

const savedPropertySchema = new mongoose.Schema({
    user_id:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
    property_id:{type: mongoose.Schema.Types.ObjectId, ref: "Property"}
}, {timestamps: true})

const saveProperty = new mongoose.model("saveProverty", savedPropertySchema)

module.exports = saveProperty