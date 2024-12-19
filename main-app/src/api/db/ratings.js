import { db } from "../firebase";
import { doc, updateDoc, arrayUnion, query, collection, where, getDocs } from "firebase/firestore";

export const addItemRating = async (itemId, itemType, rating) => {
  const itemRef = doc(db, `${itemType}`, itemId);
  await updateDoc(itemRef, {
    ratings: arrayUnion(rating),
  });
};

export const fetchRatingData = async (uid,itemType) => {
  try {
    // Query the Firestore collection for the given itemType
    const q = query(collection(db, itemType), where('merchantId','==',uid));
    const querySnapshot = await getDocs(q);

    // Initialize an array to hold the count of ratings in each range
    const ratingCounts = [0, 0, 0, 0, 0];

    querySnapshot.forEach((doc) => {
      const avgRating = doc.data().avgRating;
      if (avgRating > 0 && avgRating <= 1) {
        ratingCounts[0]++;
      } else if (avgRating > 1 && avgRating <= 2) {
        ratingCounts[1]++;
      } else if (avgRating > 2 && avgRating <= 3) {
        ratingCounts[2]++;
      } else if (avgRating > 3 && avgRating <= 4) {
        ratingCounts[3]++;
      } else if (avgRating > 4 && avgRating <= 5) {
        ratingCounts[4]++;
      } else{
        ratingCounts[5]++;
      }
    });

    return ratingCounts;
  } catch (error) {
    console.error("Error fetching rating data:", error);
    return [0, 0, 0, 0, 0]; // Return an array with zero counts in case of an error
  }
};