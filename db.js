const mongoose = require("mongoose")

const connectToDatabase = async()=>{
mongoose.connect(`${process.env.MONGODB_URL}`)
.then(()=>{
console.log("MongoDb connected Successfully..")
})
}

module.exports = connectToDatabase