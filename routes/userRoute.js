const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const {authMiddleware} = require("../middlewares/authMiddleware");

router.get("/:id", authMiddleware, UserController.getUserById);
// router.post("/login", UserController.loginUser);

module.exports = router;