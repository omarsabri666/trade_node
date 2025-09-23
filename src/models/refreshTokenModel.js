const db = require("../config/db");

async function addRefreshToken(user_id, refresh_token, expires_at) {
  await db.query(
    "insert into refresh_tokens (user_id,token,expires_at) values(?,?,?)",
    [user_id, refresh_token, expires_at]
  );
}
async function verifyRefreshToken(token, user_id) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW() AND user_id = ?",
      [token, user_id]
    );

    if (!rows.length) {
      throw new Error("Invalid refresh token");
    }

    return rows[0]; // return the token row if valid
  } catch (err) {
    throw new Error("Invalid refresh token");
  }
}
async function deleteRefreshToken(token){
  await db.query("delete from refresh_tokens where token = ?",[token]);
}
module.exports = { addRefreshToken, verifyRefreshToken, deleteRefreshToken };
