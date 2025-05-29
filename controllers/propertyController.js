const Property = require("../model/propertyModel")

const addProperty = async(req, res)=>{
try {
     const { name, description, price, location} = req.body

     const newProperty = new Property({ name, description, price, location, createdBy: req.user._id, })

     newProperty.save()

 return res.status(200).json({ message: "Property added successfully", newProperty })
    
} catch (error) {
     return res.status(500).json({ message: error.message })
}
}

const allPropertyList = async(req, res)=>{
    try {
        const allProperties = await Property.find()
        return res.status(200).json({
            message: "Successful",
            allProperties
        })
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

}

const oneProperty = async(req, res)=>{
try {
     const {id} = req.params

    const property = await Property.findById(id)

    if(!property){
        return res.status(404).json({message: "Property not found"})
    }

    return res.status(200).json({
        message: "Successful",
        property
    })

} catch (error) {
     return res.status(500).json({message: error.message})
}
}

const propertyByAvailability = async(req, res)=>{
    const {available, location} = req.query

    const filter = {}

    if (available === "true"){
        filter.isAvailable = true
    }else if (available === "false"){
        filter.isAvailable = false
    }

    if (location){
        filter.location = location
    }
    
    try {
       const result = await Property.find(filter)

       return res.status(200).json({
        message: "Success", 
        result
    })
    } catch (error) {
         return res.status(500).json({message: "Error fetching properties", error: error.message})
    }

    
}
module.exports = {
    addProperty,
    allPropertyList,
    oneProperty,
    propertyByAvailability
}
