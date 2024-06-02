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
const renterRef = collection(db, "renters")
const userRef = collection(db, "users")

//functions
//initialize the user initially in the registering process
const addUser = async (uid, fname, lname, email, phone, gender, picture, address) => {
    try {
        const userRef = doc(db, 'systemusers', uid);
        const userSnap = await getDoc(userRef)
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid:uid,
                fname: fname,
                lname: lname,
                email: email,
                phone: phone,
                gender: gender,
                picture: picture,
                address: address,
                role: "buyer"
            });
        } else{
            console.log("user exists")
        }

    } catch (e) {
        console.error('Error adding user: ', e);
    }
};

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
        const sellerList = querySnapshot.docs.map(doc => doc.data().email);
        return sellerList;
    } catch (error) {
        console.error("Error fetching seller emails:", error);
        return [];
    }
}

async function fetchRenterList() {
    try {
        const querySnapshot = await getDocs(renterRef);
        const renterList = querySnapshot.docs.map(doc => doc.data().email);
        return renterList;
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
export { addUser, getUserInfo, fetchAdminList, fetchSellerList, fetchRenterList, fetchUserList, isNUser };