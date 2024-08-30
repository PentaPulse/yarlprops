import { addDoc, arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";

const rentalRef = collection(db,'rentals')

export const addRental = async ({merchantId, title, category, type, description, quantity, location, status, images }) => {
    try {
        const docRef = await addDoc(rentalRef, {
            title,
            category,
            type,
            description,
            quantity,
            location,
            status,
            images,
            merchantId,
            timestamp: serverTimestamp()
        });
        await setDoc(docRef, { rid: docRef.id }, { merge: true });
        await updateDoc(doc(db,'systemusers',merchantId),{myRentals:arrayUnion(docRef.id)})
        return docRef.id;
    } catch (e) {
        console.error("Error adding rental:", e);
        throw new Error("Error adding rental: " + e.message);
    }
};

export const updateRental = async (id, updatedRental) => {
    try {
        const rentalDocRef = doc(db, 'rentals', id);
        await updateDoc(rentalDocRef, updatedRental);
    } catch (e) {
        console.error("Error updating rental:", e);
        throw new Error("Error updating rental: " + e.message);
    }
};

export const fetchSelectedRental = async (rid) => {
    const q = query(rentalRef, where('rid', '==', rid));
    try {
        const qSnapshot = await getDocs(q);
        if (!qSnapshot.empty) {
            const rental = qSnapshot.docs[0];
            return { id: rental.id, ...rental.data() };
        } else {
            console.log("No such rental!");
            return null;
        }
    } catch (e) {
        console.error("Error fetching rental:", e);
        throw new Error("Error fetching rental: " + e.message);
    }
};

export const countRentals = async () => {
    const productsSnapshot = await getDocs(rentalRef);
    return productsSnapshot.size;
};