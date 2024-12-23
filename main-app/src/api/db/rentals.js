import { addDoc, arrayUnion, collection, doc, getDocs, limit, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { addItemByMerchant } from "./logsManager";

const rentalRef = collection(db,'rentals')

export const addRental = async ({merchantId, title, category, subCategory, description, quantity, location, status, images }) => {
    try {
        const docRef = await addDoc(rentalRef, {
            title,
            category,
            subCategory,
            description,
            quantity,
            location,
            status,
            images,
            merchantId,
            visibility:false,
            createdAt: new Date().toISOString()
        });
        await setDoc(docRef, { rid: docRef.id }, { merge: true });
        await updateDoc(doc(db,'systemusers',merchantId),{myRentals:arrayUnion(docRef.id)})
        await addItemByMerchant(merchantId,title,docRef.id,'product')
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

export const fetchRentals = async (props) => {
    try {
        const { location, userId } = props; 
        let q;

        if (location === 'home') {            
            q = query(rentalRef, where('visibility', '==', true), limit(4));
        } else if (location === 'dash' && userId) {            
            q = query(rentalRef, where('merchantId', '==', userId),);
        } 

        const qSnapshot = await getDocs(q);
        const productList = qSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return productList;
    } catch (e) {
        console.error("Error fetching rentals:", e);
        return [];
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

export const fetchRentalOrders = async(cid)=>{
    const q = query(rentalRef,where('customers','==',cid))
    try{
        const qsnapshot = await getDocs(q)
        const productOrders = qsnapshot.docs.map((doc)=>doc.data())
        return productOrders;
    }catch(e){
        console.log(e)
    }
}

export const countRentals = async () => {
    const rentalsSnapshot = await getDocs(rentalRef);
    return rentalsSnapshot.size;
};