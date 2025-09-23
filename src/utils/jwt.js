// console.log(process.env.JWT_SECRET);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
function generateToken(payload){
   
    return jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:"6d"
    });
    

}
function generateRefreshToken(payload){
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw err;
  }
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
     throw new Error("Invalid refresh token");
  }
}


async function hashPassword(password) {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
}
async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);

}
module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken, 
    hashPassword,
    comparePassword
}
