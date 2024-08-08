import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

//filters 
export const filterByCat = async ({cat}) => {
    const proQuery = query(collection(db, 'products'),where('category','==',cat))
    try {
        const snapshot = await getDocs(proQuery)
        const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return productList
    } catch (e) {
        console.error(e)
    }
};