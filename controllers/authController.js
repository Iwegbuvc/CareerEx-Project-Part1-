const jwt = require("jsonwebtoken")
const User = require("../model/userMode")
const bcrypt = require("bcrypt")
// const sendUserEmail = require("../sendEmail")

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

// Forgot Password
// const forgotPasswordHandler = async(req, res)=>{
// try {
    
//     const {email} = req.body

//     const user = await User.findOne({email})

//     if(!user){
//         return res.status(404).json({message: "User account not found"})
//     }
//  if (!email) {
//     return res.status(400).json({ message: "Email is required" });
//   }
//     const resetToken = jwt.sign({userId: user._id}, `${process.env.RESET_TOKEN}`, {expiresIn: "15m"})
//     // Send Email

//     const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    
//     const htmlMessage = `
//       <p>Hello,</p>
//       <p>You requested a password reset.</p>
//       <p><a href="${resetLink}">Click here to reset your password</a></p>
//       <p>This link will expire in 15 minutes.</p>
//       <p>If you did not request this, you can ignore this email.</p>
//     `;

//     await sendUserEmail( {email,  subject: "Reset Password", htmlMessage })

//     return res.status(200).json({message: "Please check your email inbox."})

// } catch (error) {
//     return res.status(500).json({ message: error.message })
// }
// }

// Reset Password
// const resetPasswordHandler = async(req, res)=>{
// try {
//     const {token} = req.params
//     const {password} = req.body

//     const decoded = jwt.verify(token, process.env.RESET_TOKEN)

//     const user = await User.findById(decoded.userId)

//      if(!user){
//         return res.status(404).json({message: "User not found"})
//     }

//     const hashPassword = await bcrypt.hash(password, 12)

//     user.password = hashPassword

//     await user.save()

//     return res.status(200).json({message: "Password reset successfully"})
    
   
// } catch (error) {
//      return res.status(500).json({ message: error.message })
// }
// }

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



