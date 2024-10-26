import { auth, db } from "../firebase";
import { doc, setDoc, collection, getDoc, getDocs, where, query } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

// Register admin
export const registerAdmin = async (uid, fname, lname, dname, email) => {
    try {
        // Ensure required fields are provided
        if (!uid || !email) {
            throw new Error('Missing required user information: UID or email');
        }

        const newUserRef = doc(db, "admins", uid);
        const userSnap = await getDoc(newUserRef);

        if (!userSnap.exists()) {
            await setDoc(newUserRef, {
                uid,
                firstName: fname || '',
                lastName: lname || '',
                displayName: dname || '',
                email: email,
                phoneNumber: '',
                gender: '',
                address: '',
                approved: false
            });

            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: dname });
            }
            console.log("Admin registered successfully");
            return { success: true, message: 'Admin registered successfully' };
        } else {
            console.log("Admin already exists");
            return { success: false, message: 'Admin already exists' };
        }
    } catch (e) {
        console.error(uid, fname, lname, dname, email);
        return { success: false, message: `Error: ${e.message}` };
    }
};

// Fetch user list
export const fetchUserList = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'systemusers'));
        const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return usersList;
    } catch (error) {
        console.error("Error fetching user list:", error);
        return [];
    }
};

// Helper to count users from reference
async function countUsersFromRef(Ref) {
    try {
        const querySnapshot = await getDocs(Ref);
        return querySnapshot.size;
    } catch (error) {
        console.error("Error counting users:", error);
        return 0;
    }
}

// Count admins
export const countAdmins = async () => {
    const q = query(collection(db, 'admins'));
    return await countUsersFromRef(q);
};

// Count users (isMerchant: boolean)
export const countUsers = async (isMerchant) => {
    try {
        const q = query(collection(db, 'systemusers'), where('isMerchant', '==', isMerchant));
        return await countUsersFromRef(q);
    } catch (error) {
        console.error("Error counting users:", error);
        return 0;
    }
};

// Count sellers
export const countSellers = async () => {
    const userRef = query(collection(db, 'systemusers'), where('role', '==', 'seller'));
    return await countUsersFromRef(userRef);
};

// Count renters
export const countRenters = async () => {
    const userRef = query(collection(db, 'systemusers'), where('role', '==', 'renter'));
    return await countUsersFromRef(userRef);
};

// Fetch merchant product details by product ID
export const fetchMerchantProductDetails = async (pid) => {
    if (!pid) {
        console.error("Product ID is missing");
        return null;
    }

    try {
        const q = query(
            collection(db, 'systemusers'),
            where('isMerchant', '==', true),
            where('myProducts', 'array-contains', pid)
        );
        const merchantSnapshot = await getDocs(q);

        if (!merchantSnapshot.empty) {
            return merchantSnapshot.docs[0].data();
        } else {
            console.log("No merchant found for the given product ID");
            return null;
        }
    } catch (e) {
        console.error("Error fetching merchant product details:", e);
        return null;
    }
};

// Fetch merchant rental details by rental ID
export const fetchMerchantRentalDetails = async (pid) => {
    if (!pid) {
        console.error("Rental ID is missing");
        return null;
    }

    try {
        const q = query(
            collection(db, 'systemusers'),
            where('isMerchant', '==', true),
            where('myRentals', 'array-contains', pid)
        );
        const merchantSnapshot = await getDocs(q);

        if (!merchantSnapshot.empty) {
            return merchantSnapshot.docs[0].data();
        } else {
            console.log("No merchant found for the given rental ID");
            return null;
        }
    } catch (e) {
        console.error("Error fetching merchant rental details:", e);
        return null;
    }
};

// Fetch merchant service details by service ID
export const fetchMerchantServiceDetails = async (pid) => {
    if (!pid) {
        console.error("Service ID is missing");
        return null;
    }

    try {
        const q = query(
            collection(db, 'systemusers'),
            where('isMerchant', '==', true),
            where('myServices', 'array-contains', pid)
        );
        const merchantSnapshot = await getDocs(q);

        if (!merchantSnapshot.empty) {
            return merchantSnapshot.docs[0].data();
        } else {
            console.log("No merchant found for the given service ID");
            return null;
        }
    } catch (e) {
        console.error("Error fetching merchant service details:", e);
        return null;
    }
};
