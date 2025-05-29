const express = require("express")
const connectDatabase = require("./db")
const authsRouter = require("./route/authRoutes")
const propertyRouter = require("./route/propertyRoutes")
const savePropertyRouter = require("./route/savedPropertyRoutes")
const dotenv = require("dotenv").config()

const app = express()

// DATABASE CONNECTION
connectDatabase()

app.use(express.json())

const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})

app.use("/api", authsRouter)
app.use("/api", propertyRouter)
app.use("/api", savePropertyRouter)