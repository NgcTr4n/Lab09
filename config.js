const admin = require('firebase-admin');
const serviceAccount = require("./ecommercewebsite-6f3a3-firebase-adminsdk-78hwf-dd7012e5f7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://ecommercewebsite-6f3a3-default-rtdb.firebaseio.com`,
});

const db = admin.firestore();

module.exports = {admin, db};
