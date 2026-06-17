const UserModel = require("../models/userModel");
const refreshTokenModel = require("../models/refreshTokenModel");
const {
  hashPassword,
  comparePassword,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken : jwtVerifyRefreshToken,
} = require("../utils/jwt");

async function createUser(user) {
    console.log(user,'user');
  const hashedPassword = await hashPassword(user.password);
  user.password = hashedPassword;
  const result = await UserModel.createUser(user);
  return result;
}
async function userSignIn(email,password){
  const user = await UserModel.getUserByEmail(email);
  if (!user) throw new Error("User not found");
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");
  const token = generateToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
  await refreshTokenModel.addRefreshToken(user.id, refreshToken, expiresAt);
  return { token, refreshToken };
}
async function refreshActiveToken(refreshToken) {
  // 1. Decode the refresh token (JWT helper, not DB helper)
  const payload = jwtVerifyRefreshToken(refreshToken); // your JWT verify function

  // 2. Check the DB for this refresh token + user
  const storedToken = await refreshTokenModel.verifyRefreshToken(
    refreshToken,
    payload.id
  );
  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  // 3. Fetch user to get latest role
  const user = await UserModel.getUserById(payload.id);
  if (!user) {
    throw new Error("User not found");
  }

  // 4. Create new access token
  const newAccessToken = generateToken({ id: user.id, role: user.role });

  return { token: newAccessToken };
}
// async function deleteRefreshToken(refreshToken) {
//   await refreshTokenModel.deleteRefreshToken(refreshToken);
// }
async function deleteRefreshToken(refreshToken) {
  

  await refreshTokenModel.deleteRefreshToken(refreshToken);
}


module.exports = {
  createUser,
  userSignIn,
  refreshActiveToken,
  deleteRefreshToken,
};
