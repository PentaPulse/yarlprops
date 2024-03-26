import firebase from "firebase/compat/app";
import "firebase/firestore";
import { firebaseConfig } from "./secrets";
import { doc, setDoc,getFirestore, collection } from "firebase/firestore";

const app =firebase.initializeApp(firebaseConfig)

const db = getFirestore(app);
//references
const userRef = collection(db,"users")
const productRef = collection(db,"products")
const contactRef = collection(db,"contactUs")

export const addUser= async (uid,fName,lName,email)=>{
    await setDoc(doc(userRef,uid),{
        role:"customer",
        firstName:fName,
        lastName:lName,
        email:email
    })
}

export const addProduct =async (productId,type,name,description)=>{
    await setDoc(doc(productRef,productId),{
        name:name,
        description:description
    })
}

export const sendMessage=async (name,email,message)=>{
await setDoc(doc(contactRef,email),{
    custName:name,
    custEmail:email,
    custMessage:message
})
}