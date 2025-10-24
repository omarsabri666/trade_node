const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage})

const router = express.Router();
const productController = require("../controllers/productController");
const {authMiddleware} = require("../middlewares/authMiddleware");
const {isUUidMiddleware} = require("../middlewares/uuidMiddleWare");
router.post("/", [authMiddleware,upload.fields([{name:"mainImage",maxCount:1},{name:"images",maxCount:5}])], productController.createProduct);
router.get("/:id",isUUidMiddleware, productController.getProductById);
router.patch(
  "/:id",
  [authMiddleware, isUUidMiddleware],
  productController.updateProduct
);
router.delete(
  "/:id",
  [authMiddleware, isUUidMiddleware],
  productController.deleteProduct
);
router.post("/:id/categories", [ isUUidMiddleware], productController.linkProductToCategory);



module.exports = router;