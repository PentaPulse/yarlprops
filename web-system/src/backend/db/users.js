import firebase from "firebase/compat/app";
import "firebase/firestore";
import { firebaseConfig } from "../secrets";
import { doc, setDoc, collection, getDoc, getDocs, where, query, getFirestore } from "firebase/firestore";

const app = firebase.initializeApp(firebaseConfig)

const db = getFirestore(app);

//reference
const userRef = collection(db, "systemusers")

//functions
//initialize the user initially in the registering process
export const addUser = async (uid, fname, lname, email, phone, gender, picture, address,role) => {
    try {
        const userRef = doc(db, 'systemusers', uid);
        const userSnap = await getDoc(userRef)
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: uid,
                fname: fname,
                lname: lname,
                email: email,
                phone: phone,
                gender: gender,
                picture: picture,
                address: address,
                role: role
            });
        } else {
            console.log("user exists")
        }

    } catch (e) {
        console.error('Error adding user: ', e);
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