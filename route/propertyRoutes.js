const express = require("express")
const validateToken = require("../middleware/validateAuth")
const { addProperty, allPropertyList, oneProperty, propertyByAvailability } = require("../controllers/propertyController")
const requireRole = require("../middleware/requireRole")

const router = express.Router()

// ADD PROPERTY(only agents)
router.post("/add-property", validateToken, requireRole("agent"), addProperty)

// GET ALL PROPERTY LISTING
router.get("/properties", validateToken, allPropertyList)

// GET ONE PROPERTY BY _ID
router.get("/properties/:id", validateToken, oneProperty)

// FILTER OPTION (LOCATION & AVAILABILITY)
router.get("/property-by-availability", validateToken, propertyByAvailability)
module.exports = router