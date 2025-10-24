const db = require("../config/db");
const { v4: uuid } = require("uuid");
async function createProductImage(url,product_id){
    const id = uuid();
await db.execute("insert into images (id,url,product_id) values (?,?,?) ",[id,url,product_id]);

}

// PouTeiuE8UoJ0yRd_l1QS1vnbew
// 826477427857242