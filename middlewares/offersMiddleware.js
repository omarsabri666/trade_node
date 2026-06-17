const offerModel = require("../models/offerModel");
const productModel = require("../models/productModel");

async function offerAuth(req, res, next) {
  try {
    const userId = req.user.id;
    const offerId = req.params.id;
    const { status } = req.body;

    const offer = await offerModel.getOfferById(offerId);

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Validate that the offer is still pending
    if (offer.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending offers can be modified" });
    }

    // Authorization logic
    const isReceiverAction = ["accepted", "declined", "countered"].includes(
      status
    );
    const isSenderAction = status === "cancelled";

    if (isReceiverAction && offer.receiver_id !== userId) {
      return res
        .status(401)
        .json({ message: "Only the receiver can perform this action" });
    }

    if (isSenderAction && offer.sender_id !== userId) {
      return res
        .status(401)
        .json({ message: "Only the sender can cancel the offer" });
    }

    // ✅ If all checks pass
    next();
  } catch (error) {
    console.error("Offer Auth Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function confirmProductsOwnership(req, res, next) {
  const { sender_items, receiver_items, receiver_id } = req.body;
  const senderId = req.user.id;
  const allItems = [...sender_items, ...receiver_items];
  if (!sender_items?.length && !receiver_items?.length) {
    return res.status(400).json({ message: "No items to validate" });
  }

  try {
    const products = await productModel.getProductByIdBasicData(allItems);

    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }
    const productsMap = new Map(
      products.map((product) => [product.id, product.current_user_id])
    );

    // Check that all sender items belong to sender
    for (const id of sender_items) {
      const ownerId = productsMap.get(id);
      if (!ownerId) {
        return res.status(404).json({ message: `Product ${id} not found` });
      }
      if (ownerId !== senderId) {
        return res
          .status(403)
          .json({ message: `Product ${id} does not belong to sender` });
      }
    }

    // Check that all receiver items belong to receiver
    for (const id of receiver_items) {
      const ownerId = productsMap.get(id);
      if (!ownerId) {
        return res.status(404).json({ message: `Product ${id} not found` });
      }
      if (ownerId !== receiver_id) {
        return res
          .status(403)
          .json({ message: `Product ${id} does not belong to receiver` });
      }
    }

    next(); // ✅ Continue only if all checks pass
  } catch (error) {
    console.error("Ownership check failed:", error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { offerAuth, confirmProductsOwnership };
