import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

//FOR CUSTOMERS
export const fetchOrderCount = async (custId, status) => {
  try {
    const q = query(
      collection(db, "orders"),
      where('custId','==',custId),
      where('status', '==', status)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (e) {
    console.log("Error fetching count:", e);
    return 0;
  }
};

export const fetchFeedbackCount = async (custid) => {
  try {
    const q = query(
      collection(db, "orders"),
      where('custid','==',custid),
      where('review', '==', false)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (e) {
    console.log("Error fetching count:", e);
    return 0;
  }
};

export const fetchOrders = async (custid) => {
  try {
    const q = await getDocs(collection(db,  'orders'),where('custId','==',custid))
    const data = q.docs.map((doc) => doc.data())
    return data;
  } catch (e) {
    console.log('error fetch o hist :- ', e)
  }
}

//FOR MERCHANTS
export const fetchCustOrders=async(merchid,itemType)=>{
  try{
    const q = await getDocs(collection(db,'orders'),where('merchid','==',merchid),where('itemType','==',itemType))
    const data = q.docs.map((doc)=>doc.data())
    return data
  }catch(e){
    console.log('error fetching merch orders :- ',e)
  }
}

//FOR BOTH CUSTS AND MERCHANTS
export const addOrder = async (cust, itemId, title, itemType, merchId,merchName) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("custId", "==", cust.uid),
      where("itemId", "==", itemId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {success:false};      
    }
    const order = {
      itemId,
      title,
      itemType,
      merchId,
      merchName,
      status: "pending",
      custId: cust.uid,
      custName: cust.displayName,
      date: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "orders"), order);
    return {success:true}
  } catch (e) {
    console.log("add order error: ", e);
  }
};