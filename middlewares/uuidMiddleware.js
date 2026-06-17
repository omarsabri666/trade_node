const {validate} = require("uuid");

async  function  isUUidMiddleware  (req, res, next)  {
    const {id} = req.params;
    if(!validate(id)){
        return res.status(400).json({message:"Invalid uuid"});
    }
    next();
}

module.exports = {isUUidMiddleware};