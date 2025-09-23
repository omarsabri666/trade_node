const db = require("../config/db"   )   ;
const { v4: uuid } = require("uuid");
async function getAllUsers() {
  const [rows] = await db.query("SELECT id, username, email FROM users");
  return rows;
}
async function createUser(user) {
    const id = uuid();
    console.log(user,'user');
      const [result] = await db.query(
        "INSERT INTO users (id,first_name, last_name,  email, password) VALUES (?, ?, ?, ?,?)",
        [id,user.firstName, user.lastName, user.email, user.password]
      );
      console.log(result,'result');
      return id;
   
}
async function getUserById(id) {
  console.log(id,'id');
  const [rows] = await db.query("SELECT id , first_name, last_name, email,role,image_url,last_notification_check FROM users WHERE id = ?", [id]);
  if(!rows[0]) return null;
  return rows[0];
}
async function findOrCreateUser(user) {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE google_id = ?", [
      user.id,
    ]);
    if (rows.length > 0) return rows[0];

    const userId = uuid();
    const fullName = user.displayName || "";
    const [firstName, ...lastNameParts] = fullName.split(" ");
    const lastName = lastNameParts.join(" ");

    const email = user.emails?.[0]?.value || null;
    const image_url = user.photos?.[0]?.value || null;

    await db.query(
      "INSERT INTO users (id, google_id, first_name, last_name, email, image_url, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [userId, user.id, firstName, lastName, email, image_url, "user"]
    );

    return {
      id: userId,
      google_id: user.id,
      first_name: firstName,
      last_name: lastName,
      email,
      image_url,
      role: "user",
    };
  } catch (error) {
    throw error;
  }
}

async function getUserByEmail(email) {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  if(!rows[0]) return null;
  return rows[0];
}


module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  getUserByEmail,
  findOrCreateUser,
};
