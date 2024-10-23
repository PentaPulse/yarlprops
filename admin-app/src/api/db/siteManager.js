import { addDoc, collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

export const getQuestions=async(questionType)=>{
    try{
        const q = await getDocs(collection(db,'site','guide',questionType))
        const data = q.docs.map((doc)=>doc.data())
        return data
    }catch(e){
        return []
    }
}

export const getQuestionsFromContactus=async()=>{
    try{
        const q = await getDocs(collection(db,'contactus'))
        const data = q.docs.map((doc)=>doc.data())
        return data
    }catch(e){
        return []
    }
}

export const addQuestions=async(question)=>{
    try{
        await addDoc(collection(db,'site','guide',question.for),question)
    }catch(e){}
}