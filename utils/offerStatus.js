 const offerService = require("../services/offerService");


const statusHandler = {
  cancelled: async (offerId) => {
    await offerService.updateOfferStatus(offerId, "cancelled");
  },
  accepted: async (offerId) => {
    await offerService.updateOfferStatus(offerId, "accepted");
    // to do create a transaction
  },
  declined: async (offerId) => {
    await offerService.updateOfferStatus(offerId, "declined");
    // to do create a transaction think of soemthing
  },
  countered: async(offerId) => {
    
    try {

        // to do create a transaction think of soemthing
        await offerService.updateOfferStatus(offerId, "countered");
    } catch (error) {
        
    }
  },
};  