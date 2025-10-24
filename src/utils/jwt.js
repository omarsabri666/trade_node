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


async function createProduct(product, mainImage, images) {
  const entries = Object.entries(product).filter(([key]) =>
    allowedFields.includes(key)
  );
  if (entries.length === 0) {
    const error = new Error("No fields to update");
    error.statusCode = 400;
    throw error;
  }
  const keys = entries.map(([key]) => `${key}`).join(", ");
  const values = entries.map(([, value]) => value);

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const id = await productModel.createProduct(keys, values, connection);
    await productUserModel.createProductUser(
      id,
      product.current_user_id,
      connection
    );
    if (mainImage) {
      const uploaded = await uploadToCloudinary(mainImage);
      await insertProductImage(uploaded.url, id, true, connection);
    }
    if (images && images.length > 0) {
      for (const image of images) {
        const uploaded = await uploadToCloudinary(image);
        await insertProductImage(uploaded.url, id, false, connection);
      }
    }
    await connection.commit();
    connection.release();
    return id;
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
}