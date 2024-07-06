import "firebase/firestore";
import { db } from "../firebase";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";

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