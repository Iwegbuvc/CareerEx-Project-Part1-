const validateNewUser = async(req, res, next)=>{
    const { firstName, lastName, email, password, role } = req.body

    const errors = []

    if(!firstName) errors.push("Firstname is required")

    if(!lastName) errors.push("lastname is required")

    if(!email){
        errors.push("Please enter an email")
    }else if(!validateEmail(email)){
        errors.push("Invalid email format")
    }

    if(password.length < 8){
        errors.push("Minimum of eight characters is required for password")
    }

    if(errors.length > 0){
        return res.status(400).json({message: errors})
    }

    next()

}

function validateEmail(email){
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(String(email).toLowerCase())
}

module.exports = validateNewUser