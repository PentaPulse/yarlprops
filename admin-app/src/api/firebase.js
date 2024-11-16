import { connectAuthEmulator, getAuth } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBNssJmBhLoe2IrCWi6Gbmy-53Y6od-9zY",
  authDomain: "yarlprops.firebaseapp.com",
  projectId: "yarlprops",
  storageBucket: "yarlprops.appspot.com",
  messagingSenderId: "705284763370",
  appId: "1:705284763370:web:b2655e35aa3ce698c6b193",
  measurementId: "G-ZRR85H89Z4"
};

//const app = initializeApp(firebaseConfig)
firebase.initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();
const functions = getFunctions();

export const sendEmail = httpsCallable(functions, "sendEmail");
/*
if (window.location.hostname === "localhost" || window.location.hostname === '127.0.0.1' || window.location.hostname === '192.168.70.247') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  //connectDatabaseEmulator(realtimeDB, '127.0.0.1', 9000);
}/**/


export { db, auth, storage }

//setDoc(doc(db,'systemusers',user.uid),profile)