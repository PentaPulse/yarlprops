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

export async function addItemByMerchant(merchId,title,itemId,itemType){
    try{
        const timestamp=new Date().toISOString();
        const logDocRef=doc(collection(db,"logs",merchId,`${itemType}s`),timestamp);
        await setDoc(logDocRef,{
            addedTime:timestamp,
            itemid:itemId,
            itemName:title,
            merchantId:merchId
        })
    }catch(e){
        console.log("error occured in adding log additem : ",e)
    }
}

/*
export async function buyItemLog(userId,item){
    try{
        const timestamp = new Date().toISOString();
        const logDocRef = doc(collection(db,"logs",userId,"boughtItems"),timestamp);
        await setDoc(logDocRef,{
            itemId:item.pid||item.rid||item.sid,
            itemTitle:item.title,
            timestamp:timestamp,
            merchant:item.merchantId
        })
    }
    catch(e){

    }
}
    */