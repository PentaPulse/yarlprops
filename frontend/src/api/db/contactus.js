import "firebase/firestore";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

//reference
const contactRef = collection(db, "contactUs");

//functions
// contact us responses
export const sendMessage = async (fname, lname, email, message) => {
  try {
    const docRef = await addDoc(contactRef, {
      fname,
      lname,
      email,
      message,
      status: "new",
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error; // Rethrow error to be handled in the component
  }
};

export const fetchContactUsResponsesList = async () => {
  try {
    const querySnapshot = await getDocs(contactRef);
    const contactUsResponsesList = querySnapshot.docs.map((doc) => doc.data());
    return contactUsResponsesList;
  } catch (error) {
    console.error("Error fetching contact us:", error);
    return [];
  }
};
