const saveProperty = require("../model/savedPropertyModel")


const savingProperty = async (req, res)=>{
    try {
        const {user_id, property_id} = req.body

        const existingProperty = await saveProperty.findOne({user_id, property_id})

        if(existingProperty){
            return res.status(409).json({message: "Property already saved"})
        }
        const newSavedProperty = new saveProperty({user_id, property_id})
        newSavedProperty.save()

        return res.status(200).json({
            message: "Property saved Successful",
            newSavedProperty
        })
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const userSavedProperties = async (req, res)=>{
   try {
    const {id} = req.params

    const savedProprty = await saveProperty.find({user_id: id}).populate("property_id")

    if(saveProperty.length === 0){
        return res.status(200).json({message: "No saved properties found." })
    }
    
    return res.status(200).json({
        message: "Successful",
        savedProprty
    })
    
   } catch (error) { 
    return res.status(500).json({message: error.message})
   }
}

const unsaveProperty = async (req, res)=>{
    try {
        const {id} = req.params
         const deletedProperty = await saveProperty.findByIdAndDelete(id)
         if (!deletedProperty) {
            return res.status(404).json({ message: "Saved property not found." });
        }
         return res.status(200).json({message: "Property deleted successfully.."})
    } catch (error) {
         return res.status(500).json({message: error.message})
    }
}

module.exports = {
    savingProperty,
    userSavedProperties,
    unsaveProperty
}