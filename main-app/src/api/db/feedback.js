import { db} from '../firebase'; // Assume Firebase is initialized here
import { doc, collection, addDoc, updateDoc, getDocs, getDoc, arrayUnion, query, where } from 'firebase/firestore';

// Add feedback and calculate ratings
export const addFeedback = async (orderId,itemType,itemId, merchantId, userId, itemRating, merchantRating, feedback) => {
    const itemDocRef = doc(db, itemType, itemId);
    const orderRef = doc(db,'orders',orderId)
    const merchantDocRef = doc(db, 'systemusers', merchantId);
    const reviewRef = collection(itemDocRef, 'reviews');
    
    try {
        // Add feedback to item reviews
        await addDoc(reviewRef, { userId, itemRating, feedback, createdAt: new Date() });

        // Update item ratings
        const itemDoc = await getDoc(itemDocRef);
        const itemData = itemDoc.exists() ? itemDoc.data() : { avgRating: 0, totalRatings: 0 };
        const newItemAvg = calculateAvg(itemRating, itemData.totalRatings || 0, itemData.avgRating || 0);
        await updateDoc(itemDocRef, {
            avgRating: newItemAvg,
            totalRatings: (itemData.totalRatings || 0) + 1
        });

        // Update merchant ratings
        const merchantDoc = await getDoc(merchantDocRef);
        const merchantData = merchantDoc.exists() ? merchantDoc.data() : { avgRating: 0, totalRatings: 0 };
        const newMerchantAvg = calculateAvg(merchantRating, merchantData.totalRatings || 0, merchantData.avgRating || 0);
        await updateDoc(merchantDocRef, {
            avgRating: newMerchantAvg,
            totalRatings: (merchantData.totalRatings || 0) + 1
        });

        await updateDoc(orderRef,{
            isReviewed:true
        },{merge:true})
    } catch (error) {
        console.error('Error adding feedback:', error);
        throw error;
    }
};

// Utility to calculate average
const calculateAvg = (newRating, totalRatings, currentAvg) => {
    return ((currentAvg * totalRatings) + newRating) / (totalRatings + 1);
};

// Fetch reviews for an item
export const fetchItemReviews = async (itemType,itemId) => {
    const reviewsRef = collection(db, itemType, itemId, 'reviews');
    const snapshot = await getDocs(reviewsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch merchant and item ratings
export const fetchRatings = async (itemType,itemId, merchantId) => {
    const itemDoc = await getDoc(doc(db, itemType, itemId));
    const merchantDoc = await getDoc(doc(db, 'systemusers', merchantId)); 

    return {
        itemRating: itemDoc.exists() ? itemDoc.data().avgRating : 0,
        merchantRating: merchantDoc.exists() ? merchantDoc.data().avgRating : 0
    };
};


//remove
export const fetchProductReviews=()=>{}
export const fetchFeedbacks=()=>{}
export const getOrderDetails=()=>{}
export const sendFeedback=()=>{}