import { doc, collection, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function signinLog(userId, signinInfo) {
    try {
        const timestamp = new Date().toISOString();
        const logDocRef = doc(collection(db, 'logs', userId, 'signinlogs'), timestamp);
        await setDoc(logDocRef, {
            ...signinInfo,
            browser: navigator.userAgent,
            timestamp,
        });
        console.log('Signin log added to Firebase for user:', userId);
    } catch (e) {
        console.log("error logi")
    }
}

export async function signoutLog(userId) {
    try {
        const timestamp = new Date().toISOString();
        const logDocRef = doc(collection(db, 'logs', userId, 'signoutlogs'), timestamp);
        await setDoc(logDocRef, {
            timestamp,  // Add timestamp to the log data
        });

        console.log('Signout log added to Firebase for user:', userId);
    } catch (e) {
        console.log("error logo")
    }
}

export async function resetLog(userId){
    try{
        const timestamp = new Date().toISOString();
        const logDocRef=doc(collection(db,"logs",userId,"resetlogs"),timestamp);
        await setDoc(logDocRef,{
            timestamp
        })
        console.log('reset log added to Firebase for user:', userId);
    }catch (e) {
        console.log("error reset")
    }
}