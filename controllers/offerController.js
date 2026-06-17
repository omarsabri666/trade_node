const offerService = require('../services/offerService');

async function createOffer(req,res){
    const offer = req.body;
        const senderId = req.user.id;
        console.log(senderId,'senderId');
        offer.sender_id = senderId

    console.log(offer,'offer');
  
    try {
        const id = await offerService.createOffer(offer);
        res.status(201).json({message:"Offer created successfully",id})
    } catch(err){
        res.status(500).json({message:err.message})

    }

}
async function updateOfferStatus(req,res){
    try {
        const {status} = req.body;
        const {id:offerId} = req.params;
        console.log(status,'status');
        console.log(offerId,'offerId');

            await offerService.updateOfferStatus(offerId,status);
            res.status(200).json({message:"Offer status updated successfully"});
        
        
     
    } catch(err){
        res.status(500).json({message:err.message})
    }
    
}
async function createCounterOffer(req,res){
    try {
                const senderId = req.user.id;

        const newOffer = req.body;
        const {id:offerId} = req.params;
                newOffer.sender_id = senderId;

    ;
  const id =       await offerService.counteredOffer(newOffer, offerId);
        res.status(201).json({message:"Counter offer created successfully",offerId:id});
    } catch(err){
        res.status(500).json({message:err.message})
    }
    
}
module.exports = { createOffer, updateOfferStatus, createCounterOffer };