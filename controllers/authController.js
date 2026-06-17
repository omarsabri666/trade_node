const { validate } = require("uuid");
const authService = require("../services/authService");
async function createUser(req,res){
    console.log('req.body',req.body);
    try {
        const userId = await authService.createUser(req.body)
        res.status(201).json({message:"User created successfully",userId});

    } catch(err){
        res.status(500).json({message:err.message});

    }

}
async function userSignIn (req,res){
    const {email,password} = req.body;
    try {
        const {token,refreshToken} = await authService.userSignIn(email,password)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });
        res.status(201).json({message:"User created successfully",data:{
            token,
            
        }});

    } catch(err){
        res.status(500).json({message:err.message});

    }   

}
async function refreshActiveToken(req, res) {

    const refreshToken = req.cookies.refreshToken;


  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }
console.log(refreshToken, "token");
  try {
    const { token } = await authService.refreshActiveToken(refreshToken);
    return res
      .status(200)
      .json({ message: "Token refreshed successfully", token });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
}
async function userLogout(req, res) {
    const refreshToken = req.body.refreshToken;
    try {
        
      await authService.deleteRefreshToken(refreshToken);
      res.clearCookie("refreshToken");
      return res.status(200).json({ message: "Logout successful" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }


}
async function googleCallBack(req,res){
    try {

        const { user, token, refreshToken } = req.user;
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        res.status(200).json({ message: "success", user, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }


}
module.exports = {
  createUser,
  userSignIn,
  refreshActiveToken,
  userLogout,
  googleCallBack,
};