import firebase from "firebase/compat/app";
import "firebase/firestore";
import { firebaseConfig } from "../secrets";
import { doc, setDoc, getFirestore, collection, getDoc } from "firebase/firestore";

const app = firebase.initializeApp(firebaseConfig)

const db = getFirestore(app);

//reference
const userRef = collection(db, "users")

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