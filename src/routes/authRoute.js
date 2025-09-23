
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");


router.post("/register", authController.createUser);
router.post("/login", authController.userSignIn);
router.post("/refresh", authController.refreshActiveToken);
router.post("/logout", authMiddleware, authController.userLogout);
// router.post("/login", UserController.loginUser);

module.exports = router;