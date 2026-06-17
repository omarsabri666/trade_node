
const express = require("express");
const router = express.Router();
const passport = require("passport");
passport.authenticate("google", { scope: ["email", "profile"] });


const authController = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");


router.post("/register", authController.createUser);
router.post("/login", authController.userSignIn);
router.post("/refresh", authController.refreshActiveToken);
router.post("/logout", authMiddleware, authController.userLogout);
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get("/google/callback",  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
 authController.googleCallBack);
// router.post("/login", UserController.loginUser);

module.exports = router;