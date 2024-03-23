import firebase from "firebase/compat/app";
import "firebase/firestore";
import { firebaseConfig } from "./configs";
import { doc, setDoc } from "firebase/firestore";

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore();

export const addUser= async (uid,fName,lName,email,postal,fac,dep,regNumber)=>{
    await setDoc(doc(db,"users",uid),{
        firstName:fName,
        lastName:lName,
        email:email,
        postal:postal,
        faculty:fac,
        department:dep,
        regNumber:regNumber
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

