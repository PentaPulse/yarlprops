import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const fetchOrderCount = async (userid, status) => {
  try {
    const q = query(
      collection(db, "systemusers", userid, "orders"),
      where('status','==',status)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (e) {
    console.log("Error fetching count:", e);
    return 0;
  }
};

export const fetchFeedbackCount = async (userid) => {
  try {
    const q = query(
      collection(db, "systemusers", userid, "orders"),
      where('review','==',false)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (e) {
    console.log("Error fetching count:", e);
    return 0;
  }
};

export const fetchOrders =async(userid)=>{
  try{
    const q = await getDocs(collection(db,'systemusers',userid,'orders'))
    const data = q.docs.map((doc)=>doc.data())
    return data;
  }catch(e){
    console.log('error fetch o hist :- ',e)
  }
}

export const addOrder = async (user, itemId, itemTitle, itemType, merchantId) => {
  try {
    const order = {
      itemId, itemTitle, itemType, merchantId,status:'pending'
    }
    const docRef = await addDoc(collection(db, "systemusers", user.uid, "orders"), order)
    await addDoc(collection(db, "systemusers", merchantId, "customerorders"), {
      orderDate: new Date().toISOString(),
      customerName: user.displayName,
      //quantity:
      orderstatus: 'pending',
      custorderid: docRef.id
    })
  } catch (e) {
    console.log("add order error:-", e)
  }
}