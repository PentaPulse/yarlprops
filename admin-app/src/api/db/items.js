import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

export const fetchOrders=async()=>{
    try{
        const q = await getDocs(collection(db,"orders"))
        const data = q.docs.map((doc)=>doc.data())
        return data
    }catch(e){}
}