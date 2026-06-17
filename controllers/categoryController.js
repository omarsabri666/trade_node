const categoryService = require("../services/categoryService");
async function createCategory(req,res){
    try {
        const category = req.body;
        const id = await categoryService.createCategory(category);
        res.status(201).json({message:"Category created successfully",id})
    } catch(err){
        res.status(500).json({message:err.message})

    }

}
async function getCategoryById(req,res){
    const {id} = req.params;
    try {

        const category = await categoryService.getCategoryById(id);
        res.status(200).json({message:"success",category});
    } catch(err){
        res.status(500).json({message:err.message})
}}
async function deleteCategory(req,res){
    const {id} = req.params;
    try {

        await categoryService.deleteCategory(id);
        res.status(200).json({message:"Category deleted successfully"});
    } catch(err){
        res.status(500).json({message:err.message})
}}


module.exports = { createCategory, getCategoryById, deleteCategory };