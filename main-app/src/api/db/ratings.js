import { db } from "../firebase";
import {doc,updateDoc,arrayUnion} from 'firebase/firestore'

export const addItemRating = async (itemId,itemType, rating) => {
    const itemRef = doc(db, `${itemType}`, itemId);
    await updateDoc(itemRef, {
      ratings: arrayUnion(rating)
    });
  };