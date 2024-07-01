import firebase from "firebase/compat/app";
import "firebase/firestore";
import { firebaseConfig } from "../secrets";
import { doc, setDoc, getFirestore, collection, getDocs } from "firebase/firestore";

const app = firebase.initializeApp(firebaseConfig)

const db = getFirestore(app);
//reference
const contactRef = collection(db, "contactUs")


//functions
// contact us responses
export const sendMessage = async (name, email, message) => {
    await setDoc(doc(contactRef, email), {
        custName: name,
        custEmail: email,
        custMessage: message,
        status: 'new'
    })
}

export const fetchContactUsResponsesList = async () => {
    try {
        const querySnapshot = await getDocs(contactRef);
        const contactUsResponsesList = querySnapshot.docs.map(doc => doc.data());
        return contactUsResponsesList;
    } catch (error) {
        console.error("Error fetching contact us:", error);
        return [];
    }
}