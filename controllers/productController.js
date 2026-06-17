const productService = require('../services/productService');
async function  createProduct(req,res){
    console.log('req.body',req.body);
    try {
        const product = req.body;
        for (const key in product.categories) {
            console.log(key,'key');
            console.log(product.categories[key],'product.categories[key]');
        }
        const arr = Object.values(product.categories);
        console.log(arr,'arr');
        // console.log(product,'product');
const mainImage = req.files?.mainImage ? req.files.mainImage[0].buffer : null;
    const images = req.files?.images
      ? req.files.images.map((file) => file.buffer)
      : [];
      const {id:userId} = req.user;
      product.price = parseFloat(product.price);
   if (isNaN(product.price)) {
     return res
       .status(400)
       .json({ message: "Price must be a valid number (in cents)" });
   }
        const id = await productService.createProduct(
          product,
          userId,mainImage,
          images
        );
        res.status(201).json({message:"Product created successfully",id});


    } catch(err){
        res.status(500).json({message:err.message});
    }
    
}
async function getProductById(req,res){
    const {id} = req.params;
    try {
        const product = await productService.getProductById(id);
        res.status(200).json({message:"success",product});
    } catch(err){
        res.status(500).json({message:err.message});
    }
}
async function updateProduct(req,res){
    const product = req.body;
    const {id} = req.params;
    const {id:userId} = req.user;


    try {
        await productService.updateProduct(product,id,userId);
        res.status(200).json({message:"Product updated successfully"});
        
    } catch(err){
        res.status(err.statusCode || 500).json({message:err.message});
    }
}
async function deleteProduct(req,res){
    const {id} = req.params;
    const {id:userId} = req.user;
    try {
        await productService.deleteProduct(id,userId);
        res.status(200).json({message:"Product deleted successfully"});
        
    } catch(err){
        res.status(err.statusCode || 500).json({message:err.message});
    }
    

}
async function linkProductToCategory(req,res){
    const {id:productId} = req.params;
const { categoryIds } = req.body;
    try {
        await productService.linkProductToCategory(productId, categoryIds);
        res.status(200).json({message:"Product linked to category successfully"});
        
    } catch(err){
        res.status(err.statusCode || 500).json({message:err.message});
    }
    

}
module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  linkProductToCategory,
};