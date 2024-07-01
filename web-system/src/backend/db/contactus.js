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
        status:'new'
    })
}

async function fetchContactUsResponsesList() {
    try {
        const querySnapshot = await getDocs(contactRef);
        const ContactUsResponsesList = querySnapshot.docs.map(doc => doc.data().email);
        return ContactUsResponsesList;
    } catch (error) {
        console.error("Error fetching user emails:", error);
        return [];
    }
}

export {fetchContactUsResponsesList}