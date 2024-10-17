import "firebase/firestore";
import { db } from "../firebase";
import { doc, setDoc, collection, getDocs, query, where, addDoc, updateDoc, arrayUnion } from "firebase/firestore";

const guideRef = collection(db, "faq");


