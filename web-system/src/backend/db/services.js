import "firebase/firestore";
import { db } from "../firebase";
import { doc, setDoc, collection, getDocs, query, where, addDoc, updateDoc, orderBy, limit } from "firebase/firestore";

// Reference
const serviceRef = collection(db, "services");

// Adding services
export const addService= async ({ serviceId, serviceName, serviceDescription,  serviceLocation, images}) => {
    try {
        const docRef = await addDoc(serviceRef, {
            serviceId,
            serviceName,
            serviceDescription,
            serviceLocation,
            images,
        });
        await setDoc(docRef, { sid: docRef.id }, { merge: true });
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
        return serviceList;
    } catch (e) {
        console.error("Error fetching services:", e);
    }
};

export const fetchServicesToHome = async () => {
    const proQuery = query(collection(db, 'services'), orderBy('timestamp', 'asc'), limit(3))
    try {
        const snapshot = await getDocs(proQuery)
        const ServiceList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return ServiceList
    } catch (e) {
        console.error(e)
    }
};


// Fetching a specific Serviceby ID
export const fetchSelectedService= async (sid) => {
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

