import firebase from "firebase/compat/app";
import "firebase/firestore";
import { firebaseConfig } from "./secrets";
import { doc, setDoc, getFirestore, collection, getDoc } from "firebase/firestore";

const app = firebase.initializeApp(firebaseConfig)

const db = getFirestore(app);
//references
const userRef = collection(db, "users")
const productRef = collection(db, "products")
const contactRef = collection(db, "contactUs")


//functions
//initialize the user initially in the registering process
export const initializeUser = async (uid, fName, lName, email) => {
    await setDoc(doc(userRef, uid), {
        role: "customer",
        firstName: fName,
        lastName: lName,
        email: email
    })
}

// adding products
export const addProduct = async (productId, type, name, description) => {
    await setDoc(doc(productRef, productId), {
        name: name,
        description: description
    })
}

// contact us responses
export const sendMessage = async (name, email, message) => {
    await setDoc(doc(contactRef, email), {
        custName: name,
        custEmail: email,
        custMessage: message
    })
}

// getting user info
export const getUserInfo = async (uid) => {
    const userSnap = await getDoc(userRef,uid)
    if(userSnap.exists()){
        console.log(" doc data: ",userSnap.data());
        return userSnap.data();
    }else{
        console.log("No such docs")
    }
}