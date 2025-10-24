const offerController = require("../controllers/offerController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const express = require("express");
const router = express.Router();
router.post("/", authMiddleware,offerController.createOffer);
router.patch("/:id", authMiddleware,offerController.updateOfferStatus);
router.post("/:id/counter", authMiddleware,offerController.counteredOffer);

module.exports = router;