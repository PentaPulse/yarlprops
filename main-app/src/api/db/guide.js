import { db } from "../firebase"
import { collection, getDocs } from "firebase/firestore"

export const getGuide=async(type)=>{
    try{
        const q = await getDocs(collection(db,'site','guide',type))
        const data = q.docs.map((doc)=>doc.data())
        return data
    }catch(e){
        console.log('error getting ',type,' details :- ',e)
    }
}