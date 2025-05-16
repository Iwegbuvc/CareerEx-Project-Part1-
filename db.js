const mongoose = require("mongoose")

const connectDatabase = async()=>{
    mongoose.connect(`${process.env.MONGODB_URL}`)
    .then(()=>{
console.log(`Database connected Successfully..`)
    })
}

module.exports = connectDatabase