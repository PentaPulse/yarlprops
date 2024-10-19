import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
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

export const addOrder=async(user,itemId,itemTitle,itemType,merchantId,merchantName)=>{
  try{
    const order = {
      itemId,itemTitle,itemType,merchantId,merchantName
    }
    const docRef=await addDoc(collection(db,"systemusers",user.uid,"orders"),{...order,id:docRef.id})
    await addDoc(collection(db,"systemusers",merchantId,"customerorders"),{
      orderDate:new Date().toISOString(),
      customerName:user.displayName,
      //quantity:
      orderStatus:'pending'
    })
  }catch(e){
    console.log("add order error:-",e)
  }
}