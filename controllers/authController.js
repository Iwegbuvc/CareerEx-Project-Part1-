const jwt = require("jsonwebtoken")
const User = require("../model/userMode")
const bcrypt = require("bcrypt")
const transporter = require("../utilities/nodeMailer")


// Register New User
const registerUserHandler = async (req, res)=>{
  try {
    const  { firstName, lastName, email, password, role } = req.body

    const existingUser = await User.findOne({email})

    if(existingUser){
        return res.status(401).json({message: "User already exist"})
    }
    
    const hashPassword = await bcrypt.hash(password, 12)

    const newUser = new User({ firstName, lastName, email, password: hashPassword, role })

    newUser.save()

        //  SENDING EMAIL TO USER EMAIL
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Congrat on registering with us",
            text: `Welcome to SafeHeaven website. Your account has been succesfully created with this email: ${email} `
        }

        await transporter.sendMail(mailOptions)


        return res.status(200).json({
        message: "User registration successful"},
        newUser
    )
  } catch (error) {
        return res.status(500).json({ message: error.message })
  }
}

// Login Registered User
const loginUserHandler = async(req, res)=>{
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

    const accessToken = jwt.sign({userId: user._id}, `${process.env.ACCESS_TOKEN}`, {expiresIn: "1d"})
     const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN, { expiresIn: "7d" })

     res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
     } )

     const { _id, firstName: name, email: userEmail, role } = user

        return res.status(200).json({
            message: "Login successful",
            user:{_id, firstName: name, email: userEmail, role},
            accessToken,
        })
    } catch (error) {
         return res.status(500).json({ message: error.message })
    } 
}

// REFRESH TOKEN HANDLER
const refreshTokenHandler = async(req, res)=>{
   try {
     const {refreshToken} = req.cookies

    if(!refreshToken){
        return res.status(401).json({ message: "Refresh token missing" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN)

    if(!decoded){
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    const newAccessToken = jwt.sign({userId: decoded.userId}, `${process.env.ACCESS_TOKEN}`, {expiresIn: "20m"})

    return res.status(200).json({accessToken:  newAccessToken})

   } catch (error) {
      return res.status(500).json({ message: error.message });
   }
}

// Forgot Password
const forgotPasswordHandler = async(req, res)=>{
try {
    const {email} = req.body
     if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
     const user = await User.findOne({email})

    if(!user){
        return res.status(404).json({message: "User account not found"})
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    user.resetOtp = otp
    // const hashedOtp = await bcrypt.hash(otp, 12)
    // user.resetOtp = hashedOtp
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000
    await user.save()
    const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Password Reset OTP",
        text:`Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`
    }

    await transporter.sendMail(mailOption)
  
    return res.status(200).json({message: "OTP sent to your email."})

} catch (error) {
    return res.status(500).json({ message: error.message })
}
}

// RESET USER PASSWORD
const resetPasswordHandler = async(req, res)=>{
try {
    const { email, otp, newPassword } = req.body
    if(!email || !otp || !newPassword){
      return res.status(400).json({message: "Email, OTP, and new password are required"})
    }
    const user = await User.findOne({email})

     if(!user){
        return res.status(404).json({message: "User not found"})
    }
    if(user.resetOtp === "" || user.resetOtp !== otp){
        return res.status(400).json({message: "Invalid OTP"})
    }
    if(user.resetOtpExpireAt < Date.now()){
        return res.status(400).json({message: "OTP Expired"})
    }
    const hashPassword = await bcrypt.hash(newPassword, 12)
    user.password = hashPassword
    user.resetOtp = "",
    user.resetOtpExpireAt = 0
    await user.save()
    return res.status(200).json({message: "Password reset successfully"})
    
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
    registerUserHandler,
    loginUserHandler,
    refreshTokenHandler,
    forgotPasswordHandler,
    resetPasswordHandler,
    allRegisteredUsers
}



