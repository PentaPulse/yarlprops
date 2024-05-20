import firebase from "firebase/compat/app";
import "firebase/firestore";
import { firebaseConfig } from "../secrets";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { authUser } from "../autharization";

const app = firebase.initializeApp(firebaseConfig)

const db = getFirestore(app);

//reference
const adminRef = collection(db, "admins")
const sellerRef = collection(db, "sellers")
const userRef = collection(db, "users")

// fetching lists
async function fetchAdminList() {
    try {
        const querySnapshot = await getDocs(adminRef);
        const adminList = querySnapshot.docs.map(doc => doc.data().email);
        return adminList;
    } catch (error) {
        console.error("Error fetching admin emails:", error);
        return [];
    }
}
async function fetchSellerList() {
    try {
        const querySnapshot = await getDocs(sellerRef);
        const sellerList = querySnapshot.docs.map(doc => doc.data().email);
        return sellerList;
    } catch (error) {
        console.error("Error fetching seller emails:", error);
        return [];
    }
}
async function fetchUserList() {
    try {
        const querySnapshot = await getDocs(userRef)
        const userList = querySnapshot.docs.map(doc => doc.data().email)
        return userList
    } catch (e) {
        console.error("Error fetching user emails:", e)
        return []
    }
}


//checking accesses
async function CheckUserAccess() {
    const adminList = await fetchAdminList();
    const sellerList = await fetchSellerList();
    const userList = await fetchUserList();

    onAuthStateChanged(authUser, user => {
        if (user) {
            const userEmail = user.email;
            if (adminList.includes(userEmail)) {
                console.log("Admin Access granted");
                window.location.href = '/admin';
            } else if (sellerList.includes(userEmail)) {
                console.log("Seller Access granted");
                window.location.href = '/seller';
            }
            if (userList.includes(userEmail)) {
                console.log("User Access granted");
                window.location.href = '/user'
            }
        } else {
            console.log("No user is signed in");
            window.location.href = '/'
        }
    });
}
export { CheckUserAccess };