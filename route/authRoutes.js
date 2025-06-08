const express = require("express")
const { validateLogin, validateNewUser } = require("../middleware/validation")
const { loginUserHandler, allRegisteredUsers, registerUserHandler, forgotPasswordHandler, resetPasswordHandler, refreshTokenHandler } = require("../controllers/authController")

const router = express.Router()

// REGISTER USER
router.post("/auth/register", validateNewUser, registerUserHandler)

//  GET ALL USER REGISTERED ROUTE
router.get("/registered-users", allRegisteredUsers)

// USER LOGIN ROUTE
router.post("/auth/login", validateLogin, loginUserHandler)

// AUTO REFRESH USER ACCESS TOKEN
router.post("/refresh-token", refreshTokenHandler)

// USER FORGET PASSWORD
router.post("/auth/user-reset-otp", forgotPasswordHandler)

// USER RESET PASSWORD
router.post("/auth/reset-user-password", resetPasswordHandler)

module.exports = router