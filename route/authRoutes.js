const express = require("express")
const { validateLogin, validateNewUser } = require("../middleware/validation")
const { loginUser, allRegisteredUsers, registerUser } = require("../controllers/authController")

const router = express.Router()

// REGISTER USER
router.post("/auth/register", validateNewUser, registerUser)

//  GET ALL USER REGISTERED ROUTE
router.get("/registered-users", allRegisteredUsers)

// USER LOGIN ROUTE
router.post("/auth/login", validateLogin, loginUser)

module.exports = router