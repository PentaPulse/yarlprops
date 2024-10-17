import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const fetchCount = async (userid, fieldkey, equal, fieldvalue) => {
  try {
    const q = query(
      collection(db, "systemusers", userid, "orders"),
      where(fieldkey, equal, fieldvalue)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (e) {
    console.log("Error fetching count:", e);
    return 0;
  }
};
