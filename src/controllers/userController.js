const {validate:isUuid}   = require("uuid")
const userService = require("../services/userService");
async function getUserById(req,res){
    const {id} = req.params;
    if(!isUuid(id)) return res.status(400).json({message:"Id is not valid"});
    
    try {
        const user = await userService.getUserById(id);
        if(!user) return res.status(404).json({message:"User not found"});
        res.status(200).json({message:"success",user});

    } catch(err){
        res.status(500).json({message:err.message});

    } 

}

module.exports = {getUserById}