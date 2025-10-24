const { uploadToCloudinary } = require("../config/cloud");
const db = require("../config/db");
const { insertProductImage } = require("../models/imageModel");
const productModel = require("../models/productModel")
const productUserModel = require("../models/productUserModel");
const allowedFields = ["name", "price","description","status"];

async function createProduct(product, currentUserId, mainImage, images) {
  let categories = [];
  if(product.categories){

     categories = Object.values(product.categories);
  }

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

    const id = await productModel.createProduct(
      keys,
      values,
      connection,
      currentUserId
    );

    await productUserModel.createProductUser(
      id,
      currentUserId,
      connection
    );
    if(categories.length > 0){

      await linkProductToCategory(id, categories, connection);
    }
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
// async function getProductById(id){
//     const product = await productModel.getProductById(id);
    
//     return {
//       ...product,
//       urls: product?.urls ? product.urls.split(",") : [],
//     };

// }
async function getProductById(id){
    const product = await productModel.getProductById(id);
    console.log(product,'product');
    let categories = [];
    if(product?.category_ids){
      console.log('run')

      const categoryIds = product["category_ids"].split("," ) || [];
      const categoryNames = product["category_names"].split(",") || []; 
      categories = categoryIds.map((id, i) => {
     return {
       id,
       name: categoryNames[i],
     };
   })
    }
    console.log(categories);
  
  console.log(product);
  
  const { "category_ids": _, "category_names": __, ...rest } = product;

    return {
    ...rest,
      urls: product?.urls ? product.urls.split(",") : [],
      categories
      
    };

}
async function updateProduct(product,id,userId){
const entries = Object.entries(product).filter(([key]) => allowedFields.includes(key));
if(entries.length === 0){
    const error = new Error ("No fields to update");
    error.statusCode = 400;
    throw error;
    
}
const  setClause = entries.map(([key]) => `${key} = ?`).join(", ");
const values = entries.map(([, value]) => value);


  // product gonna be an obj
  // safe fields
  // const values = Object.values(product)
  // const keys = Object.keys(product).filter(key=> allowedFields.includes(key)).map(value=> );


//   console.log(values, keys);
  await productModel.updateProduct(setClause, values, id, userId);
}
async function deleteProduct(id,userId){

    await productModel.deleteProduct(id,userId);
}
async function linkProductToCategory(productId,categoriesId,connection){
// const arr = Array.isArray(categoriesId)
//   ? categoriesId
//   : [categoriesId];  

//   console.log(arr,'arr');
  // categoriesId.forEach((categoryId) => {
  //   console.log(categoryId,'categoryId');
  // })
  // console.log(categoriesId,'categoriesId');
  // console.log(typeof categoriesId,'typeof categoriesId');
  if(categoriesId.length === 0){
    const error = new Error ("No fields to update");
    error.statusCode = 400;
    throw error;
  }
  if(!Array.isArray(categoriesId)){
    const error = new Error ("categoriesId must be an array");
    error.statusCode = 400;
    throw error;
  }


    await productModel.linkProductToCategory(
      productId,
      categoriesId,
      connection
    );
}
module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  linkProductToCategory,
};