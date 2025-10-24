const {v2:cloudinary}  = require("cloudinary");
cloudinary.config({
  cloud_name: "dqzs5qxfj",
  api_key: "826477427857242",
  api_secret: "PouTeiuE8UoJ0yRd_l1QS1vnbew",
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