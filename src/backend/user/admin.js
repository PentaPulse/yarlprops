import firebase from "firebase/compat/app";
import "firebase/firestore";
import { firebaseConfig } from "../secrets";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const app = firebase.initializeApp(firebaseConfig)

const db = getFirestore(app);
const auth = getAuth(app)

//reference
const adminRef = collection(db, "admins")

async function fetchAdminEmails() {
    try {
        const querySnapshot = await getDocs(adminRef);
        const adminEmails = querySnapshot.docs.map(doc => doc.data().email)
        return adminEmails
    }
    catch (e) {
        console.error("Error fetching emails", e);
        return [];
    }
}

const admins = await fetchAdminEmails();

export { admins,auth}