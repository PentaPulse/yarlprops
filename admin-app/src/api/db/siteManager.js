import { addDoc, collection, deleteDoc, getDocs, where } from "firebase/firestore"
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


/*export const addSlide=()=>{
try{
    const docRef=await addDoc(collection(db, 'site'), {
        title: newSlideTitle,
        mediaUrl,
        mediaType: newSlideType,
        createdAt: new Date(),
        popularity: 0, // set initial popularity
    });

    await setDoc(docRef, { id: docRef.id }, { merge: true });
}catch(e){}
}*/

export const removeSlide=async(id)=>{
    try{
        await deleteDoc(collection(db,'site'),where('id','==',id))
    }catch(e){}
}