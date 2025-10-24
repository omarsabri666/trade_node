const db = require("../config/db");
const offerModel = require("../models/offerModel");

 async function createOffer(offer,connection = null)  {
   const { sender_items, receiver_items, ...offerData } = offer;
   const shouldRelease = !connection; // ✅ if no connection was passed in, we'll create one later
   if (!connection) {
     connection = await db.getConnection();
   }

   // const connection = await db.getConnection();
   try {
     await connection.beginTransaction();
     const id = await offerModel.createOffer(offerData, connection);
     await offerModel.addItemsToOffer(
       id,
       sender_items,
       receiver_items,
       connection
     );
     await connection.commit();
     if(shouldRelease){
     connection.release();
     }
     return id;
   } catch (error) {
     await connection.rollback();
     if(shouldRelease){

         connection.release();
        }
     throw error;
   }
 }
async function updateOfferStatus(offerId,status,connection=null){
    await offerModel.updateOfferStatus(offerId,status,connection);
}
async function counteredOffer(offer,parentOfferId){
    const connection = await db.getConnection();
    try {
     await   connection.beginTransaction();
                  await  updateOfferStatus(parentOfferId,'countered',connection);
      const id =   await createOffer(offer,connection);
      await connection.commit();
      connection.release();
      return id



    } catch(error){
        connection.rollback();
        connection.release();
        
    }

}

module.exports = { createOffer, updateOfferStatus, counteredOffer };