const admin = require('firebase-admin');
const serviceAccount = require('./tldrai-firebase.json'); // Path to your service account JSON

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://tldrai-f784a.appspot.com'
});

const bucket = admin.storage().bucket();
module.exports = bucket;
