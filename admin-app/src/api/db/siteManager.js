import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";


export const getQuestions = async (questionType) => {
  try {
    const q = await getDocs(collection(db, "site", "guide", questionType));
    const data = q.docs.map((doc) => ({
      id: doc.id, 
      ...doc.data(),
    }));
    return data;
  } catch (e) {
    console.error("Error fetching questions:", e);
    return [];
  }
};


export const getQuestionsFromContactus = async () => {
  try {
    const q = await getDocs(collection(db, "contactus"));
    const data = q.docs.map((doc) => ({
      id: doc.id, 
      ...doc.data(),
    }));
    return data;
  } catch (e) {
    console.error("Error fetching contact us questions:", e);
    return [];
  }
};


export const addQuestions = async (question) => {
  try {
    const docRef = await addDoc(collection(db, "site", "guide", question.for), {
      ...question,
      uploaded: true,
    });
    await setDoc(
        doc(db, 'site', 'guide', question.for), 
        { faqId: docRef.id },                   
        { merge: true }                         
      );
    console.log("Question added with ID:", docRef.id);
  } catch (e) {
    console.error("Error adding question:", e);
  }
};


export const deleteQuestion = async (questionType, questionId) => {
  try {
    const docRef = doc(db, "site", "guide", questionType, questionId);
    await deleteDoc(docRef);
    console.log("Question deleted:", questionId);
  } catch (e) {
    console.error("Error deleting question:", e);
  }
};

export const removeSlide = async (id) => {
  try {
    await deleteDoc(collection(db, "site"), where("id", "==", id));
  } catch (e) {}
};

export const sendEmail = async (to, subject, text) => {
  const response = await axios.post(
    "https://yp-backend-rho.vercel.app/api/send-email",
    { to, subject, text },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};
