import "firebase/firestore";
import { auth, db } from "../firebase";
import { doc, setDoc, collection, getDoc, getDocs, where, query, addDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

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
                firstName: fname || '',
                lastName: lname || '',
                email: email,
                phoneNumber: '',
                gender: '',
                address: '',
                isMerchant: false
            });
            await updateProfile(auth.currentUser, { displayName: dname })
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

//register admin
export const registerAdmin = async (uid, fname, lname, dname, email) => {
    try {
        // Ensure all required fields are provided
        if (!uid || !email) {
            throw new Error('Missing required user information');
        }

        const newUserRef = doc(db, "admins", uid);
        const userSnap = await getDoc(newUserRef);

        if (!userSnap.exists()) {
            await setDoc(newUserRef, {
                uid,
                firstName: fname || '',
                lastName: lname || '',
                email: email,
                phoneNumber: '',
                gender: '',
                address: '',
                approved: false
            });
            await updateProfile(auth.currentUser, { displayName: dname })
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

export const countAdmins = async () => {
    const q = query(collection(db, 'admins'))
    return await countUsersFromRef(q)
}

export const countUsers = async (isMerchant) => {
    const q = query(collection(db, 'systemusers'), where('isMerchant', '==', isMerchant));
    return await countUsersFromRef(q);
};

export const fetchMerchantProductDetails = async (pid) => {
    const q = query(
        collection(db, 'systemusers'),
        where('isMerchant', '==', true),
        where('myProducts', 'array-contains', pid)
    );

    try {
        const merchantSnapshot = await getDocs(q);
        if (!merchantSnapshot.empty) {
            const merchantData = merchantSnapshot.docs[0].data();
            return merchantData;
        } else {
            console.log("No merchant found for the given product ID");
            return [];
        }
    } catch (e) {
        console.error("Error fetching merchant details:", e);
        return null;
    }
};

export const fetchMerchantRentalDetails = async (pid) => {
    const q = query(
        collection(db, 'systemusers'),
        where('isMerchant', '==', true),
        where('myRentals', 'array-contains', pid)
    );

    try {
        const merchantSnapshot = await getDocs(q);
        if (!merchantSnapshot.empty) {
            const merchantData = merchantSnapshot.docs[0].data();
            return merchantData;
        } else {
            console.log("No merchant found for the given rental ID");
            return [];
        }
    } catch (e) {
        console.error("Error fetching merchant details:", e);
        return null;
    }
};

export const fetchMerchantServiceDetails = async (pid) => {
    const q = query(
        collection(db, 'systemusers'),
        where('isMerchant', '==', true),
        where('myServices', 'array-contains', pid)
    );

    try {
        const merchantSnapshot = await getDocs(q);
        if (!merchantSnapshot.empty) {
            const merchantData = merchantSnapshot.docs[0].data();
            return merchantData;
        } else {
            console.log("No merchant found for the given service ID");
            return [];
        }
    } catch (e) {
        console.error("Error fetching merchant details:", e);
        return null;
    }
};