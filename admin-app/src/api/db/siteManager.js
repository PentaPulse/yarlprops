import { addDoc, collection, deleteDoc, getDocs, where } from "firebase/firestore"
import { db } from "../firebase"
import axios from "axios"

export const getQuestions = async (questionType) => {
    try {
        const q = await getDocs(collection(db, 'site', 'guide', questionType))
        const data = q.docs.map((doc) => doc.data())
        return data
    } catch (e) {
        return []
    }
}

export const getQuestionsFromContactus = async () => {
    try {
        const q = await getDocs(collection(db, 'contactus'))
        const data = q.docs.map((doc) => doc.data())
        return data
    } catch (e) {
        return []
    }
}

export const addQuestions = async (question) => {
    try {
        await addDoc(collection(db, 'site', 'guide', question.for), question)
    } catch (e) { }
}

export const removeSlide = async (id) => {
    try {
        await deleteDoc(collection(db, 'site'), where('id', '==', id))
    } catch (e) { }
}

export const sendEmail = async (to,subject,text) => {
    const response = await axios.post('https://yp-backend-rho.vercel.app/api/send-email', {to,subject,text}, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response;
}