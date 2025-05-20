const express = require("express")
const bcrypt = require("bcrypt")
const connectDatabase = require("./db")
const User = require("./model/userMode") 
// || require("./model/authModel")
const Property = require("./model/propertyModel")
const { validateNewUser, validateLogin } = require("./middleware/validation") 
const jwt = require("jsonwebtoken")
const validateToken = require("./middleware/validateAuth")
const requireRole = require("./middleware/requireRole")
const dotenv = require("dotenv").config()

const app = express()

// Connect to Database
connectDatabase()

app.use(express.json())

const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})

// Register a new user

app.post("/auth/register", validateNewUser || validateRegistration, async (req, res) => {
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

// Login user

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

//  Get all registered users
 
app.get("/registered-users", async (req, res) => {
    try {
        const allUsers = await User.find()
        return res.status(200).json({ message: "Success", allUsers })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

// Add property (only agents)

app.post("/add-property", validateToken, requireRole("agent"), async (req, res) => {
    try {
        // const { id } = req.params

        // const user = await User.findById(id)
        // if (!user) {
        //     return res.status(404).json({ message: "User not found" })
        // }

        // if (user.role !== "agent") {
        //     return res.status(400).json({ message: "Only agents can post properties." })
        // }

        const { name, description, price, location} = req.body
        const newProperty = new Property({ name, description, price, location, createdBy: req.user._id, })

        await newProperty.save()

        return res.status(200).json({ message: "Property added successfully", newProperty })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

app.post("/protected", validateToken, (req, res)=>{

res.json({ message: "You accessed a protected route!" })
})
