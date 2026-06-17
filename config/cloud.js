const {v2:cloudinary}  = require("cloudinary");
require('dotenv').config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
function uploadToCloudinary(fileBuffer) {

    return new Promise((reslove,reject)=>{
        cloudinary.uploader.upload_stream({resource_type:"image"},(err,result)=>{
            if (err) return reject(err);
            reslove(result);    
        })
        .end(fileBuffer);
    })
}

module.exports = {uploadToCloudinary};