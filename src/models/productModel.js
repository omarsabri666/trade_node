const db = require("../config/db");
const { v4: uuid } = require("uuid");
async function createProduct(keys,values,connection,currentUserId){
    const id = uuid();
    console.log(values,'values');
    console.log(keys,'keys');
    console.log(currentUserId, "current_user_id");
    // console.log(connection,'connection');
    // console.log(id,'id');
    if ([id, currentUserId, ...values].some((v) => v === undefined)) {
      throw new Error("Cannot insert undefined value into database");
    }
    // const placeHolders = values.map(() => "?").join(", ");
    const placeHolders = new Array(values.length + 2).fill("?").join(", ");
    console.log(placeHolders,'placeHolders');
    const query = `INSERT INTO products (id, current_user_id,${keys} ) VALUES (${placeHolders})`;
    const valuesToQuery = [id, currentUserId, ...values];
    console.log(query,'query');
    console.log(values,'values');
     await connection.execute(query, valuesToQuery); 
    return id
}
// async function getProductById(id) {
//   const [rows] = await db.execute(
//     `SELECT 
//       p.id,
//       p.name,
//       p.price,
//       u.first_name as user_first_name,
//       u.last_name as user_last_name,
//       p.current_user_id as user_id,
//       GROUP_CONCAT(i.url) AS urls,
//       (
//         SELECT i2.url 
//         FROM images i2 
//         WHERE i2.product_id = p.id 
//           AND i2.is_main = true
//         LIMIT 1
//       ) AS main_image
//     FROM products p
//     LEFT JOIN images i 
//       ON p.id = i.product_id 
//       AND i.is_main = false
//       join users u on p.current_user_id = u.id
//     WHERE p.id = ?
//     GROUP BY p.id, p.name;`,
//     [id]
//   );

//   if (!rows[0]) return null;

//   return rows[0];

 
// }
async function getProductById(id) {
  //       GROUP_CONCAT(distinct c.name) AS "category_names",
  // GROUP_CONCAT( distinct c.id) AS "category_ids",
  // left  join products_category pc on p.id = pc.product_id
  // left  join categories c on pc.category_id = c.id
  const [rows] = await db.execute(
    `SELECT 
      p.id,
      p.name,
      p.price,
      u.first_name as user_first_name,
      u.last_name as user_last_name,
      p.current_user_id as user_id,
   
      GROUP_CONCAT( distinct i.url) AS urls,
        GROUP_CONCAT( distinct c.name) AS category_names,
          GROUP_CONCAT( distinct c.id) AS category_ids,

      (
        SELECT i2.url 
        FROM images i2 
        WHERE i2.product_id = p.id 
          AND i2.is_main = true
        LIMIT 1
      ) AS main_image
    FROM products p
    LEFT JOIN images i 
      ON p.id = i.product_id 
      AND i.is_main = false
      join users u on p.current_user_id = u.id
    left  join products_category pc on p.id = pc.product_id
     left join categories c on pc.category_id = c.id
 
    WHERE p.id = ?
    GROUP BY p.id, p.name;`,
    [id]
  );

  console.log(rows[0], "rows");
  if (!rows[0]) return null;

  return rows[0];
}
async function updateProduct( setClause, values, id, userId) {
  const [result] = await db.execute(
    `UPDATE products SET ${setClause} WHERE id = ? AND current_user_id = ?`,
    [...values, id, userId]
  );

  if (result.affectedRows === 0) {
    const error = new Error(
      "No products found for this user"
    );
    error.statusCode = 404;
    throw error; // ❗ Throwing the error
  } 


  return result;
}
async function deleteProduct(id,userId) {
  const [result] = await db.execute(
    `delete from products where id = ? AND current_user_id = ?`,
    [id, userId]
  );
   if (result.affectedRows === 0) {
     const error = new Error("No products found for this user");
     error.statusCode = 404;
     throw error; // ❗ Throwing the error
   } 
  return result;
}
async function linkProductToCategory(productId,categoriesId,connection = db){

  const values = categoriesId.map((id) => ("(?,?)")).join(", ");
  const params = categoriesId.flatMap((id) => [productId, id]);
  await connection.execute(`insert into products_category (product_id,category_id) values ${values}`,params);

  // db.execute(`insert into product_category (product_id,category_id) values (?,?)`,[productId,categoryId]);

}
// async function getProductById(id) {
//   const [rows] = await db.execute(
//     `SELECT 
//       p.id,
//       p.name,
//       p.price,
//       u.first_name as user_first_name,
//       u.last_name as user_last_name,
//       p.current_user_id as user_id,
//       GROUP_CONCAT(i.url) AS urls,
//       (
//         SELECT i2.url 
//         FROM images i2 
//         WHERE i2.product_id = p.id 
//           AND i2.is_main = true
//         LIMIT 1
//       ) AS main_image
//     FROM products p
//     LEFT JOIN images i 
//       ON p.id = i.product_id 
//       join users u on p.current_user_id = u.id
//       AND i.is_main = false
//     WHERE p.id = ?
//     GROUP BY p.id, p.name;`,
//     [id]
//   );

//   if (!rows[0]) return null;

//   return rows[0];
// }

module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  linkProductToCategory,
};
