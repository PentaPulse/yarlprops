import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const getOrders = async (user) => {
  const q = query(
    collection(db, 'orders'),
    where('custId', '==', user.uid)
  );

  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc) => doc.data());
  return data;
};

export const getOrderDetails=async(order)=>{
    const itemq = await getDocs(collection(db,order.itemType),where(`${order.itemType.charAt(0)}id`,'==',order.itemId))
    const merchq = await getDocs(collection(db,'systemusers'),where('uid','==',order.merchId))

    const itemData = itemq.docs.map((doc)=>doc.data())
    const merchData = merchq.docs.map((doc)=>doc.data())

    return {...itemData,...merchData,...order}
}