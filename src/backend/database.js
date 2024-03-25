import firebase from "firebase/compat/app";
import "firebase/firestore";
import { firebaseConfig } from "./secrets";
import { doc, setDoc,getFirestore } from "firebase/firestore";

const app =firebase.initializeApp(firebaseConfig)

const db = getFirestore(app);

export const addUser= async (uid,fName,lName,email)=>{
    await setDoc(doc(db,"users",uid),{
        firstName:fName,
        lastName:lName,
        email:email
    })
}

