const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "01110901681Dd",
    database: "trade_app",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: "utc",
});

module.exports = db;


// async function getProductById(id){
//     const product = await productModel.getProductById(id);
//     let categories = [];
//     if(product?.category_ids){
//       console.log('run')

//       const categoryIds = product["category_ids"].split("," ) || [];
//       const categoryNames = product["category_names"].split(",") || []; 
//       categories = categoryIds.map((id, i) => {
//      return {
//        id,
//        name: categoryNames[i],
//      };
//    })
//     }
//     console.log(categories);
  
//   console.log(product);
  
//   // const { "category_ids": _, "category_names": __, ...rest } = product;

//     return {
//     ...product,
//       urls: product?.urls ? product.urls.split(",") : [],
//       categories
      
//     };

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
      join users u on p.current_user_id = u.id
      AND i.is_main = false
 
    WHERE p.id = ?
    GROUP BY p.id, p.name;`,
    [id]
  );

  if (!rows[0]) return null;
  console.log(rows[0], "rows");

  return rows[0];
}