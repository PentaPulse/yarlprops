import { collection, query, where, getDocs,addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const getOrderDetails = async (order) => {
    const itemq = await getDocs(collection(db, order.itemType), where(`${order.itemType.charAt(0)}id`, '==', order.itemId))
    const merchq = await getDocs(collection(db, 'systemusers'), where('uid', '==', order.merchId))

    const itemData = itemq.docs.map((doc) => doc.data())
    const merchData = merchq.docs[0]?.data().displayName;

    return merchData
}

export const sendFeedback=async(custId,merchId,feedbackData)=>{
    await addDoc(collection(db,'systemusers',merchId,'feedbacks'),feedbackData)
    await addDoc(collection(db,'systemusers',custId,'reviews'),feedbackData)
}

export const fetchFeedbacks=async(custId)=>{
    const q = await getDocs(collection(db,'systemusers',custId,'reviews'))
    const data = q.docs.map((doc)=>doc.data())
    return data
}

export const fetchProductReviews = async (itemId,merchId) => {
    try {
      const reviewsRef = collection(db, 'systemusers', merchId, "feedbacks");
  
      const reviewsSnapshot = await getDocs(reviewsRef,where('itemId','==',itemId));
  
      const reviews = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() 
      }));
  
      return reviews;
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      return [];
    }
  };