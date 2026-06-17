const {createOffer,createCounterOffer,updateOfferStatus} = require("../controllers/offerController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {confirmProductsOwnership,offerAuth} = require("../middlewares/offersMiddleware")


const express = require("express");
const router = express.Router();
router.post(
  "/",
  [authMiddleware, confirmProductsOwnership],
  createOffer
);
router.patch("/:id", [authMiddleware,offerAuth],updateOfferStatus);
router.post("/:id/counter", [authMiddleware,confirmProductsOwnership,offerAuth], createCounterOffer);

module.exports = router;