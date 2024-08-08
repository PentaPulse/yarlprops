const admin = required('firebase-admin');
const serviceAccount = required('../serviceAccountKey.json');

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
});

module.exports=admin;