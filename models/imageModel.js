const { v4: uuid } = require("uuid");
const db = require("../config/db");
async function insertProductImage(url,productId,isMain,connection){
    const id = uuid();
  await connection.execute(
    "insert into images (id,url,product_id,is_main) values (?,?,?,?) ",
    [id, url, productId, isMain]
  );


}


module.exports = { insertProductImage };