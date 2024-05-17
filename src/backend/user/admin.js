import firebase from "firebase/compat/app";
import "firebase/firestore";
import { firebaseConfig } from "../secrets";
import { doc, setDoc, getFirestore, collection, getDoc, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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

async function checkAdminAccess() {
    const adminEmails = await fetchAdminEmails();

    onAuthStateChanged(auth, user => {
        if (user) {
            const userEmail = user.email;
            if (adminEmails.includes(userEmail)) {
                console.log("Access granted to /admin path");
                // Proceed to /admin path
                // window.location.href = '/admin'; // Uncomment to redirect
            } else {
                console.log("Access denied to /admin path");
                // Handle access denial (e.g., redirect to a different page or show an error message)
                // window.location.href = '/not-authorized'; // Uncomment to redirect
            }
        } else {
            console.log("No user is signed in");
            // Handle case where no user is signed in
            // window.location.href = '/login'; // Uncomment to redirect
        }
    });
}

// Call the function to check admin access
export default checkAdminAccess();