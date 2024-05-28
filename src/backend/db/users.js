import firebase from "firebase/compat/app";
import "firebase/firestore";
import { firebaseConfig } from "../secrets";
import { doc, setDoc, getFirestore, collection, getDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { authUser } from "../autharization";

const app = firebase.initializeApp(firebaseConfig)

const db = getFirestore(app);

//reference
const adminRef = collection(db, "admins")
const sellerRef = collection(db, "sellers")
const userRef = collection(db, "users")

//functions
//initialize the user initially in the registering process
const initializeUser = async (uid, fName, lName, email) => {
    await setDoc(doc(userRef, uid), {
        role: "customer",
        firstName: fName,
        lastName: lName,
        email: email
    })
}

// getting user info
const getUserInfo = async (uid) => {
    const userSnap = await getDoc(userRef, uid)
    if (userSnap.exists()) {
        console.log(" doc data: ", userSnap.data());
        return userSnap.data();
    } else {
        console.log("No such docs")
    }
}

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
        const sellerList = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                email: data.email,
                role: data.role
            };
        });
        return sellerList;
    } catch (error) {
        console.error("Error fetching seller emails:", error);
        return [];
    }
}
/*
async function fetchRole(){
    try{
        const querySnapshot = await getDocs(sellerRef)
        const chooseRole = querySnapshot.docs.map(doc=>doc.data().role);
        return chooseRole;
    } catch(e){
        console.log("Error fetching seller renter role: ",e)
    }
}*/

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

//check for normal user
async function isNUser() {
    const nUserList = await fetchUserList();
    onAuthStateChanged(authUser, user => {
        if (user) {
            const userEmail = user.email
            if (nUserList.includes(userEmail)) {
                return true;
            }
        }
    })
}
export { initializeUser, getUserInfo, fetchAdminList, fetchSellerList, fetchUserList, isNUser };