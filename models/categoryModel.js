const db = require("../config/db");
const { v4: uuid } = require("uuid");
async function getAllCategories() {
    const [rows] = await db.execute("SELECT * FROM categories");
    return rows;
}
async function createCatrgory(keys,values) {
    const placeHolder = new Array(values.length + 1).fill("?").join(", ");
    const id = uuid();
    await db.execute(`insert into categories (id,${keys}) values (${placeHolder}) `,[id,...values]);
    return id;
    
}
async function getCategoryById(id) {
    const [rows] = await db.execute("SELECT * FROM categories WHERE id = ?", [id]);
    return rows[0];
}
async function deleteCategory(id) {
    await db.execute("DELETE FROM categories WHERE id = ?", [id]);
}
module.exports = {
  getAllCategories,
  createCatrgory,
  getCategoryById,
  deleteCategory,
};