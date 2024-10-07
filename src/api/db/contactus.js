import "firebase/firestore";
import { db } from "../firebase";
import { collection, getDocs, addDoc, setDoc, query, where, serverTimestamp } from "firebase/firestore";

//reference
const contactRef = collection(db, "contactus");

//functions
// contact us responses
export const sendMessage = async (fname, lname, email, message) => {
  try {
    const docRef = await addDoc(contactRef, {
      firstName:fname,
      lastName:lname,
      email,
      message,
      status: "new",
      timestamp: serverTimestamp()
    });
    await setDoc(docRef, { id: docRef.id }, { merge: true });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error; // Rethrow error to be handled in the component
  }
};

export const fetchSelectedRequest = async (id) => {
  const q = query(contactRef, where('id', '==', id));
  try {
      const qSnapshot = await getDocs(q);
      if (!qSnapshot.empty) {
          const request = qSnapshot.docs[0];
          return { id: request.id, ...request.data() };
      } else {
          console.log("No such request!");
          return null;
      }
  } catch (e) {
      console.error("Error fetching request:", e);
      throw new Error("Error fetching request: " + e.message);
  }
};