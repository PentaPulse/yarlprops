import firebase from "firebase/compat/app";
import "firebase/firestore";
import { firebaseConfig } from "./secrets";
import { doc, setDoc } from "firebase/firestore";

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore();

export const addUser= async (uid,fName,lName,email)=>{
    await setDoc(doc(db,"users",uid),{
        firstName:fName,
        lastName:lName,
        email:email
    })
}

db.collection("products").add({
    name:"Bodim",
    description:"lorem",
    gender:"girls",
    price:"10000",
    pictures:{
        pic1:"1",
        pic2:"2",
        pic3:"3",
        pic4:"4"
    }
})
.then((docRef)=>{
    console.log("Doc id : ",docRef.id)
})
.catch((error) => {
    console.error("Error adding document: ", error);
});

