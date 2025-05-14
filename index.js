const express = require("express")
const connectToDatabase = require("./db")
const Users = require("./model/authModel")
const dotenv = require("dotenv").config()
const bcrypt = require("bcryptjs")
const { validateRegistration, validateLogin } = require("./middleware/validations")

const app = express()

const PORT = process.env.PORT || 4000

// Connect Database
connectToDatabase()

app.use(express.json())

app.listen(PORT, ()=>{
    console.log(`Server running on PORT:${PORT}`)
})

// User__Registration/Sign__Up
app.post("/register", validateRegistration, async(req, res)=>{
try {
    const { FirstName, lastName, email, password } = req.body

    const existingUser = await Users.findOne({email})

    if(existingUser){
       return res.status(400).json({message: "User already registered"})
    }

    // Authenticating the password
    const hashPassword = await bcrypt.hash(password, 12)

    const newUser = new Users({ FirstName, lastName, email, password: hashPassword })
    newUser.save()

    return res.status(200).json({
    message: "Successful",
    newUser
})
} catch (error) {
    return res.status(500).json({message: error.message})
}  
})

// User__Login
app.post("/login", validateLogin, async(req, res)=>{
    try {

        const {email, password} = req.body

        const user = await Users.findOne({email})

        if(!user){
            return res.status(400).json({message: "User account not found"})
        }

        const isMatched = await bcrypt.compare(password, user?.password)

        if(!isMatched){
            return res.status(400).json({message: "Email or Password not correct"})
        }
        

        
res.status(200).json({message: "Login Successful"})
    } catch (error) {
        
    }
})


