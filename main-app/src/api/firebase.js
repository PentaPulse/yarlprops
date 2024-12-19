import { connectAuthEmulator, getAuth } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
//import { getDatabase, connectDatabaseEmulator } from "firebase/database";
//import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER_ID,
  appId:process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

//const app = initializeApp(firebaseConfig)
firebase.initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();
//const realtimeDB = getDatabase()

/*
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6Ld8mQkqAAAAADb9fn9eJaoq4mAkcZ0SKA8-5sbE'),
  isTokenAutoRefreshEnabled: true
});
*/

if (window.location.hostname === "localhost" || window.location.hostname === '127.0.0.1' || window.location.hostname === '192.168.147.145') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  //connectDatabaseEmulator(realtimeDB, '127.0.0.1', 9000);
}


export { db, auth, storage }

//setDoc(doc(db,'systemusers',user.uid),profile)