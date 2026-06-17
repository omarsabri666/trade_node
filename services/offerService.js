const db = require("../config/db");
const offerModel = require("../models/offerModel");

//  async function createOffer(offer,connection = null)  {
//    const { sender_items, receiver_items, ...offerData } = offer;
  
//    const shouldRelease = !connection; // ✅ if no connection was passed in, we'll create one later
//    if (!connection) {
//      connection = await db.getConnection();
//    }

//    // const connection = await db.getConnection();
//    try {
//      await connection.beginTransaction();
//      const id = await offerModel.createOffer(offerData, connection);
//      await offerModel.addItemsToOffer(
//        id,
//        sender_items,
//        receiver_items,
//        connection
//      );
//      await connection.commit();
//      if(shouldRelease){
//      connection.release();
//      }
//      return id;
//    } catch (error) {
//      await connection.rollback();
//      if(shouldRelease){

//          connection.release();
//         }
//      throw error;
//    }
//  }
async function createOffer(offer, connection = null) {
  const { sender_items, receiver_items, ...offerData } = offer;

  const isNewConnection = !connection;

  if (isNewConnection) {
    connection = await db.getConnection();
  }

  try {
    // ✅ Only start transaction if WE created the connection
    if (isNewConnection) {
      await connection.beginTransaction();
    }

    const id = await offerModel.createOffer(offerData, connection);
    await offerModel.addItemsToOffer(
      id,
      sender_items,
      receiver_items,
      connection
    );

    // ✅ Only commit if WE started the transaction
    if (isNewConnection) {
      await connection.commit();
    }

    return id;
  } catch (error) {
    // ✅ Only rollback if WE started the transaction
    if (isNewConnection) {
      await connection.rollback();
    }
    throw error;
  } finally {
    // ✅ Only release if WE created the connection
    if (isNewConnection) {
      connection.release();
    }
  }
}
async function updateOfferStatus(offerId,status,connection){
    // console.log(connection,'connection service');
    await offerModel.updateOfferStatus(offerId,status,connection);
}
// async function counteredOffer(offer,parentOfferId){
//     const connection = await db.getConnection();
//     try {
//      await   connection.beginTransaction();
//       await  updateOfferStatus(parentOfferId,'countered',connection);
//       const id =   await createOffer(offer,connection);
//       await connection.commit();
//       connection.release();
//       return id



//     } catch(error){
//       await  connection.rollback();
//         connection.release();
        
//     }

// }
// async function counteredOffer(offer, parentOfferId) {
//   const connection = await db.getConnection();

//   try {
//     await connection.beginTransaction();

//     // 1. Update parent offer status
//     await updateOfferStatus(parentOfferId, "countered", connection);

//     // 2. Create new counter offer using the same connection
//     const id = await createOffer(offer, connection);

//     // 3. Commit transaction
//     await connection.commit();

//     return id;
//   } catch (error) {
//     // Rollback on any failure
//     await connection.rollback();
//     throw error;
//   } finally {
//     // Always release, even if success or error
//     connection.release();
//   }
// }
// async function counteredOffer(offer, parentOfferId) {
//   const connection = await db.getConnection();
//   console.log("Connection type:", connection.constructor.name);
//   console.log("Has beginTransaction?", typeof connection.beginTransaction);
//   console.log("Connection ID:", connection.threadId); // ✅ This should show a number

//   try {
//     await connection.beginTransaction();
//     console.log("Transaction started");

//     // 1. Update parent offer status
//     await updateOfferStatus(parentOfferId, "countered", connection);
//     console.log("Status updated");

//     // 2. Create new counter offer
//     const id = await createOffer(offer, connection);
//     console.log("Offer created");

//     // 3. Commit transaction
//     await connection.commit();
//     console.log("Transaction committed");

//     return id;
//   } catch (error) {
//     console.log("Error occurred, rolling back:", error.message);
//     await connection.rollback();
//     console.log("Rollback complete");
//     throw error;
//   } finally {
//     connection.release();
//   }
// }
async function counteredOffer(offer, parentOfferId) {
  const connection = await db.getConnection();

  console.log("Connection type:", connection.constructor.name);
  console.log("Has beginTransaction?", typeof connection.beginTransaction);
  console.log("Connection ID:", connection.threadId); // ✅ This should show a number

  try {
    await connection.beginTransaction();
    console.log("Transaction started on thread:", connection.threadId);

    await updateOfferStatus(parentOfferId, "countered", connection);
    console.log("Status updated on thread:", connection.threadId);

    const id = await createOffer(offer, connection);

    await connection.commit();
    return id;
  } catch (error) {
    console.log("Rolling back on thread:", connection.threadId);
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
module.exports = { createOffer, updateOfferStatus, counteredOffer };