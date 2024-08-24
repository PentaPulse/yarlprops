import "firebase/firestore";
import { db } from "../firebase";
import { doc, setDoc, collection, getDoc, getDocs, where, query } from "firebase/firestore";

//reference
const userRef = collection(db, "systemusers")

//functions
//register user
export const registerUser = async (uid, fname, lname, dname, email) => {
    try {
        // Ensure all required fields are provided
        if (!uid || !email) {
            throw new Error('Missing required user information');
        }

        const newUserRef = doc(db, "systemusers", uid);
        const userSnap = await getDoc(newUserRef);

        if (!userSnap.exists()) {
            await setDoc(newUserRef, {
                uid,
                fname: fname || '',
                lname: lname || '',
                dname: dname || '',
                email:email,
                phone: '',
                gender: '',
                picture: '',
                address: '',
                role:'customer'
            });
            console.log("User registered successfully");
            return { success: true, message: 'User registered successfully' };
        } else {
            console.log("User already exists");
            return { success: false, message: 'User already exists' };
        }
    } catch (e) {
        const eMsg = e.message;
        const eCode = e.code || 'unknown_error';

        console.log(`${eCode}: ${eMsg}`);
        return { success: false, message: `${eCode}: ${eMsg}` };
    }
};

// fetching lists
export const fetchUserList = async () => {
    try {
        const querySnapshot = await getDocs(userRef);
        const usersList = querySnapshot.docs.map(doc => doc.data());
        return usersList;
    } catch (error) {
        console.error("Error fetching user emails:", error);
        return [];
    }
}

//counts
async function countUsersFromRef(Ref) {
    try {
        const querySnapshot = await getDocs(Ref);
        return querySnapshot.size;
    } catch (error) {
        console.error("Error fetching user count:", error);
        return 0;
    }
}

export const countUsers = async () => {
    const usersRef = collection(db, 'systemusers');
    return await countUsersFromRef(usersRef);
};

export const countSellers = async () => {
    const userRef = query(collection(db, 'systemusers'), where('role', '==', 'seller'));
    return await countUsersFromRef(userRef);
};

export const countRenters = async () => {
    const userRef = query(collection(db, 'systemusers'), where('role', '==', 'renter'));
    return await countUsersFromRef(userRef);
};