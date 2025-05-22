const jwt = require("jsonwebtoken")
const User = require("../model/userMode")

const validateToken = async (req, res, next)=>{
try {
    
    const authHeader = req.header("Authorization")

    if(!authHeader){
        return res.status(401).json({message: "Access Denied!"})
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)

    if (!decoded){
        return res.status(401).json({message: "Invalid login details"})
    }

    const user = await User.findOne({_id: decoded.userId})

    if(!user){
        return res.status(404).json({message: "User account not found!"})
    }

  // req.user = user
  req.user = {id: user._id, role: user.role }

    next()

} catch (error) {
  return res.status(401).json({ message: "Invalid or expired token" });
}
}

module.exports = validateToken