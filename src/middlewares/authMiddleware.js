const { verifyToken } = require("../utils/jwt");

function authMiddleware(req,res,next){
    console.log('auth middleware');
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token) return res.status(401).json({message:"Unauthorized"});
    try {
        const payload = verifyToken(token);
        console.log(payload,'payload');
        req.user = payload;
        next();
    } catch (error) {
        console.log(error,'error');
  if (error.message === "TokenExpired") {
    return res.status(401).json({ message: "Token expired" });
  }
  return res.status(403).json({ message: "Invalid token" });    }


}

module.exports = {authMiddleware}