import "firebase/firestore";
import { db } from "../firebase";
import { doc, setDoc, collection, getDocs, query, where, addDoc, updateDoc,  arrayUnion, serverTimestamp } from "firebase/firestore";

// Reference
const serviceRef = collection(db, "services");

// Adding services
export const addService= async ({ merchantId, title, description, location, images }) => {
    try {
        const docRef = await addDoc(serviceRef, {
            merchantId,
            title,
            description,
            location,
            images,
            timestamp: serverTimestamp()
        });
        await setDoc(docRef, { sid: docRef.id }, { merge: true });
        await updateDoc(doc(db,'systemusers',merchantId),{myServices:arrayUnion(docRef.id)})
        return docRef.id;
    } catch (e) {
        console.error("Error adding Service:", e);
        throw new Error("Error adding Service: " + e.message);
    }
};

// Updating a Service
export const updateService= async (id, updatedService) => {
    try {
        const serviceDocRef = doc(db, 'services', id);
        await updateDoc(serviceDocRef, updatedService);
    } catch (e) {
        console.error("Error updating Service:", e);
        throw new Error("Error updating Service: " + e.message);
    }
};

// Fetching all services
export const fetchServices = async () => {
    try {
        const qSnapshot = await getDocs(serviceRef);
        const serviceList = qSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched services:", serviceList);
        return serviceList;
    } catch (e) {
        return []
    }
};

// Fetching a specific Service by ID
export const fetchSelectedService = async (sid) => {
    if (!sid) {
        console.error("Service ID is undefined");
        throw new Error("Service ID is undefined");
    }
    const q = query(serviceRef, where('sid', '==', sid));
    try {
        const qSnapshot = await getDocs(q);
        if (!qSnapshot.empty) {
            const service= qSnapshot.docs[0];
            return { id: service.id, ...service.data() };
        } else {
            console.log("No such Service!");
            return null;
        }
    } catch (e) {
        console.error("Error fetching Service:", e);
        throw new Error("Error fetching Service: " + e.message);
    }
};

//count services
export const countservices = async () => {
    const servicesSnapshot = await getDocs(serviceRef);
    return servicesSnapshot.size;
};

