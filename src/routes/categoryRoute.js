const express = require("express");
const categoryController = require("../controllers/categoryController");
const router = express.Router();
router.post("/", categoryController.createCategory);
router.get("/:id", categoryController.getCategoryById);

module.exports = router;