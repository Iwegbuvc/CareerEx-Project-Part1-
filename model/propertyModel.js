const mongoose = require("mongoose")

const propertySchema = new mongoose.Schema({
    name: {type: String},
    description: {type: String},
    price: {type:Number},
    location: {type: String},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
},{timestamps: true})

const Property = new mongoose.model("Property", propertySchema)

module.exports = Property