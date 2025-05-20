const validateRegistration = async(req, res, next)=>{
    const { FirstName, lastName, email, password } = req.body

    const errors = []

    if(!email){
        errors.push("Please enter your email")
    }

    if(password.length < 8){
        errors.push("Minimum of eight characters is required for password")
    }

    if(errors.length > 0){
        return res.status(400).json({message: errors})
    }

    next()
}

const validateLogin = async(req, res, next)=>{
    const {email, password} = req.body

    const errors = []

    if(!email){
        errors.push("Please add your email")
    }else if (!validateEmail(email)){
        errors.push("Email format is incorrect")
    }

    if (!password){
        errors.push("Please add your password")
    }

    if (errors.length > 0){
        return res.status(400).json({message: errors})
    }

    next()
}

function validateEmail(email){
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(String(email).toLowerCase())
}

module.exports = {
    validateRegistration,
    validateLogin
}