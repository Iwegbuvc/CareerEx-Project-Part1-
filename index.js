const express = require("express")
const bcrypt = require("bcrypt")
const connectDatabase = require("./db")
const User = require("./model/userMode") 
const Property = require("./model/propertyModel")
const { validateNewUser, validateLogin } = require("./middleware/validation") 
const jwt = require("jsonwebtoken")
const validateToken = require("./middleware/validateAuth")
const requireRole = require("./middleware/requireRole")
const saveProperty = require("./model/savedPropertyModel")
const dotenv = require("dotenv").config()

const app = express()

// DATABASE CONNECTION
connectDatabase()

app.use(express.json())

const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})

// REGISTER NEW USER
app.post("/auth/register", validateNewUser, async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashPassword = await bcrypt.hash(password, 12)
        const newUser = new User({ firstName, lastName, email, password: hashPassword, role })

        await newUser.save()

        return res.status(200).json({
            message: "User registration successful",
            newUser
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

//  GET ALL USER REGISTERED
app.get("/registered-users", async (req, res) => {
    try {
        const allUsers = await User.find()
        return res.status(200).json({ message: "Success", allUsers })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

// USER LOGIN
app.post("/auth/login", validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "User account not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Email or password incorrect" })
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN, { expiresIn: "35m" })
        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN, { expiresIn: "35m" })

        return res.status(200).json({
            message: "Login successful",
            user,
            accessToken,
            refreshToken
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

// ADD PROPERTY(only agents)
app.post("/add-property", validateToken, requireRole("agent"), async (req, res) => {
    try {
        const { name, description, price, location} = req.body
        const newProperty = new Property({ name, description, price, location, createdBy: req.user._id, })

        await newProperty.save()

        return res.status(200).json({ message: "Property added successfully", newProperty })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

// GET ALL PROPERTY LISTING
app.get("/properties", validateToken, async(req, res)=>{
    try {
        const allProperties = await Property.find()
        return res.status(200).json({
            message: "Successful",
            allProperties
        })
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

})

// GET ONE PROPERTY BY _ID
app.get("/properties/:id", validateToken, async(req, res)=>{
try {
     const {id} = req.params

    const property = await Property.findById(id)

    if(!property){
        return res.status(401).json({message: "Property not found"})
    }

    return res.status(200).json({
        message: "Successful",
        property
    })

} catch (error) {
     return res.status(500).json({message: error.message})
}
})

// SAVE PROPERTY
app.post("/save-property", validateToken, requireRole("user"), async(req, res)=>{
    try {
        const { user_id, property_id } = req.body

    const existingProperty = await saveProperty.findOne({property_id})

    if(existingProperty){
        return res.status(401).json({message: "Property already saved.."})
    }

    const newSavedProp = new saveProperty({user_id, property_id})

    await newSavedProp.save()

    return res.status(200).json({
        message: "Successful"},
        newSavedProp)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
})
// ALL SAVED PROPERTIES
app.get("/saveProperties/:id", validateToken, async(req, res)=>{
  try {
      const {id} = req.params
    
    const savedProprty = await saveProperty.find({user_id: id}).populate("property_id")

    if(savedProprty.length === 0){
    return res.status(200).json({message: "No saved properties found." })
    }

    return res.status(200).json({message: "Successful"}, savedProprty)
    } catch (error) {
    return res.status(500).json({message: error.message})
    }
})
// UNSAVE A PROPERTY
app.delete("/unsave-property", validateToken, async(req, res)=>{
    try {
        const {id} = req.body
    const unsaveProperty = await saveProperty.findByIdAndDelete(id)
    return res.status(200).json({message: "Property was successfully unsaved"})
    } catch (error) {
         return res.status(500).json({message: error.message})
    }
    
})
