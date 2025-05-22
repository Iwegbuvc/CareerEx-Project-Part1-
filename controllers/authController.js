const jwt = require("jsonwebtoken")
const User = require("../model/userMode")
const bcrypt = require("bcrypt")

// Register New User
const registerUser = async (req, res)=>{
  try {
    const  { firstName, lastName, email, password, role } = req.body

    const existingUser = await User.findOne({email})

    if(existingUser){
        return res.status(401).json({message: "User already exist"})
    }
    
    const hashPassword = await bcrypt.hash(password, 12)

    const newUser = new User({ firstName, lastName, email, password: hashPassword, role })

    newUser.save()
    return res.status(200).json({
        message: "User registration successful"},
        newUser
    )
  } catch (error) {
        return res.status(500).json({ message: error.message })
  }
}

// Login Registered User
const loginUser = async(req, res)=>{
    try {
        const {email, password} = req.body

    const user = await User.findOne({email})

    if(!user){
        return res.status(404).json({message: "User account not found"})
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.status(401).json({message: "User email or password incorrect!"})
    }

    const accessToken = jwt.sign({userId: user._id}, `${process.env.ACCESS_TOKEN}`, {expiresIn: "20m"})
     const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN, { expiresIn: "7d" })

        return res.status(200).json({
            message: "Login successful",
            user,
            accessToken,
            refreshToken
        })
    } catch (error) {
         return res.status(500).json({ message: error.message })
    }
    

}

// Get All Registered Users 
const allRegisteredUsers = async (req, res)=>{
try {
    const allUser = await User.find()

    return res.status(200).json({
        message: "Successful",
        allUser
    })
    
} catch (error) {
   return res.status(500).json({ message: error.message })  
}
}

module.exports = {
    registerUser,
    loginUser,
    allRegisteredUsers
}



