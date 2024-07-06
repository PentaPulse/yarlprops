import { getAuth } from 'firebase/auth';
//import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
//import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

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
const db = getFirestore()
const auth = getAuth()
const storage = getStorage();

/*
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6Ld8mQkqAAAAADb9fn9eJaoq4mAkcZ0SKA8-5sbE'),
  isTokenAutoRefreshEnabled: true
});
*/
export { db,auth,storage}

//setDoc(doc(db,'systemusers',user.uid),profile)