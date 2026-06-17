const categoryModel = require("../models/categoryModel");
const allowedFields = ["name","description","is_active"];

async function getAllCategories() {
    const result = await categoryModel.getAllCategories();
    return result;
}
async function  createCategory(category){
    const entries = Object.entries(category).filter(([key])=> allowedFields.includes(key));
    if(entries.length === 0){
        const error = new Error("No fields to update");
        error.statusCode = 400;
        throw error;
    }
    const keys = entries.map(([key])=> `${key}`).join(", ");
    const values = entries.map(([, value])=> value);
    const result = await categoryModel.createCatrgory(keys,values);
    return result;
    


}
async function getCategoryById(id){
    const result = await categoryModel.getCategoryById(id);
    return result;
}
async function deleteCategory(id){
    const result = await categoryModel.deleteCategory(id);
    return result;
}

module.exports = {
  getAllCategories,
  createCategory,
  getCategoryById,
  deleteCategory,
};