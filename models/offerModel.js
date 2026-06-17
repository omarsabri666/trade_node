const db = require("../config/db");
const { v4: uuid } = require("uuid");
async function createOffer(offerObject,connection=db) {
    const id = uuid();
    const entries = Object.entries(offerObject).filter(([_, value]) => value !== undefined);
   const keys = entries.map(([key]) => key);
   const values = entries.map(([_, value]) => value);
  const placeholders = keys.map(() => "?").join(", ");


 const sql = `
    INSERT INTO offers (id, ${keys.join(", ")})
    VALUES (?, ${placeholders})
  `;
  await connection.execute(
    sql,
    [id, ...values]
);
  return id
}
async function addItemsToOffer(offerId,senderItems,receiverItems,connection=db) {
const values = [];
for(const items of senderItems){
    values.push([offerId,items,'sender']);
}
for(const items of receiverItems){
    values.push([offerId,items,'receiver']);
}





  await connection.query(
    `INSERT INTO offer_products (offer_id, product_id, owner) VALUES ?`,
    [values]
  );


}
async function updateOfferStatus(offerId,status,connection=db) {
  console.log(connection,'connection');
  // console.log(connection,'connection');
    // console.log("Model received connection thread:", connection.threadId);
    // console.log("Connection type in model:", connection.constructor.name);
 const [result] = await connection.execute(
    "update offers set status = ? where id = ?",
    [status, offerId]
  );

  if (result.affectedRows === 0) {
    const error = new Error( "cannot update offer status"
    );
    error.statusCode = 401;
    throw error; // ❗ Throwing the error
  }

}
async function getOfferById(offerId,connection=db) {
  const [result] = await connection.execute(
    "select * from offers where id = ?",
    [offerId]
  );
  return result[0];
}


module.exports = { createOffer, addItemsToOffer, updateOfferStatus, getOfferById };