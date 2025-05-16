const express = require("express")
const bcrypt = require("bcrypt")
const connectDatabase = require("./db")
const User = require("./model/userMode")
const Property = require("./model/propertyModel")
const validateNewUser = require("./middleware/validation")
const dotenv = require("dotenv").config()

const app = express()

connectDatabase()

app.use(express.json())

PORT = process.env.PORT || 9000

app.listen(PORT, ()=>{
    console.log(`Server running on Port ${PORT}`)
})


// CREATE USER
app.post("/register", validateNewUser, async(req, res)=>{
    try {
        const { firstName, lastName, email, password, role } = req.body

        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(404).json({message:"User already exist"})
        }

        const hashPassword = await bcrypt.hash(password, 12)

        const newUser = await User({ firstName, lastName, email, password:hashPassword, role })
        newUser.save()

        return res.status(200).json({
            message: "Successful",
            newUser
        })

    } catch (error) {
       return res.status(500).json({message: error.message}) 
    }
})
// GET ALL USERS REGISTERED
app.get("/registered-users", async(req, res)=>{
    try {
        const allUsers = await User.find()

        return res.status(200).json({
            message: "Successful",
        allUsers
        })
        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

})
//ADD PROPERTY
app.post("/add-property/:id", async(req, res)=>{
try {
    const {id} = req.params

    const user = await User.findById(id)
    if (!user){
     return res.status(404).json({message: "User not found"})
    }

    if(user.role !== "agent"){
        return res.status(400).json({message: "Only agents can post properties."})
    }

    const {  name, description, price, location } = req.body 

    const newProperty = new Property({name, description, price, location})

    newProperty.save()

    return res.status(200).json({
        message: "Successful",
    newProperty
    })
} catch (error) {
    return res.status(500).json({message: error.message})
}
})

