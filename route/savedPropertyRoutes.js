const express = require("express")
const validateToken = require("../middleware/validateAuth")
const { userSavedProperties, savingProperty, unsaveProperty } = require("../controllers/savePropertyContoller")
const requireRole = require("../middleware/requireRole")

const router = express.Router()

// SAVE PROPERTY
router.post("/save-property", validateToken, requireRole("user"), savingProperty)

// ALL USER SAVED PROPERTIES
router.get("/saveProperties/:id", validateToken, userSavedProperties )

// UNSAVE A PROPERTY
router.delete("/unsave-property/:id", validateToken, unsaveProperty)

module.exports = router