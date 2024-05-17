import firebase from "firebase/compat/app";
import "firebase/firestore";
import { firebaseConfig } from "./secrets";
import { doc, setDoc, getFirestore, collection, getDoc } from "firebase/firestore";

const app = firebase.initializeApp(firebaseConfig)

const db = getFirestore(app);
//reference
const productRef = collection(db, "products")


//functions

// adding products
export const addProduct = async (productId, type, name, description) => {
    await setDoc(doc(productRef, productId), {
        name: name,
        description: description
    })
}