const db = require("../config/db");

async function createProductUser(product_id, user_id,connection) {
const boughtAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    await connection.execute(
      "insert into products_users (product_id,user_id,bought_at) values (?,?,?)",
      [product_id, user_id, boughtAt]
    );
}

module.exports = { createProductUser };