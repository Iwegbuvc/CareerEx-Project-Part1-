const express = require("express")
const connectDatabase = require("./db")
const { validateNewUser, validateLogin } = require("./middleware/validation") 
const validateToken = require("./middleware/validateAuth")
const requireRole = require("./middleware/requireRole")
const { registerUser, loginUser, allRegisteredUsers, forgotPasswordHandler, resetPasswordHandler } = require("./controllers/authController")
const { addProperty, allPropertyList, oneProperty } = require("./controllers/propertyController")
const { savingProperty, userSavedProperties, unsaveProperty } = require("./controllers/savePropertyContoller")
const Property = require("./model/propertyModel")
const dotenv = require("dotenv").config()

const app = express()

// DATABASE CONNECTION
connectDatabase()

app.use(express.json())

const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})

// REGISTER NEW USER
app.post("/auth/register", validateNewUser, registerUser)

//  GET ALL USER REGISTERED
app.get("/registered-users", allRegisteredUsers)

// USER LOGIN
app.post("/auth/login", validateLogin, loginUser)

// FORGOT PASSWORD
app.post("/forgot-password", forgotPasswordHandler)

// RESET PASSWORD
app.patch("/reset-password", resetPasswordHandler)

// ADD PROPERTY(only agents)
app.post("/add-property", validateToken, requireRole("agent"), addProperty)

// GET ALL PROPERTY LISTING
app.get("/properties", validateToken, allPropertyList)

// GET ONE PROPERTY BY _ID
app.get("/properties/:id", validateToken, oneProperty)

// SAVE PROPERTY
app.post("/save-property", validateToken, requireRole("user"), savingProperty)

// ALL USER SAVED PROPERTIES
app.get("/saveProperties/:id", validateToken, userSavedProperties )

// UNSAVE A PROPERTY
app.delete("/unsave-property/:id", validateToken, unsaveProperty)


app.get("/property-by-availability")
