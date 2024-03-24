import firebase from 'firebase/compat/app';

const firebaseConfig = {
  apiKey: "AIzaSyBNssJmBhLoe2IrCWi6Gbmy-53Y6od-9zY",
  authDomain: "yarlprops.firebaseapp.com",
  projectId: "yarlprops",
  storageBucket: "yarlprops.appspot.com",
  messagingSenderId: "705284763370",
  appId: "1:705284763370:web:b2655e35aa3ce698c6b193",
  measurementId: "G-ZRR85H89Z4"
};

firebase.initializeApp(firebaseConfig);

export { firebaseConfig }