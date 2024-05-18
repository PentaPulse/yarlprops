import firebase from "firebase/compat/app";
import "firebase/firestore";
import { firebaseConfig } from "../secrets";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { authUser } from "../autharization";
import * as React from 'react'
import { useNavigate } from "react-router-dom";

const app = firebase.initializeApp(firebaseConfig)

const db = getFirestore(app);
//const auth = getAuth(app)

//reference
const adminRef = collection(db, "admins")


async function fetchAdminEmails() {
    try {
        const collectionRef = collection(db, "admins");
        const querySnapshot = await getDocs(collectionRef);
        const adminEmails = querySnapshot.docs.map(doc => doc.data().email);
        return adminEmails;
    } catch (error) {
        console.error("Error fetching admin emails:", error);
        return [];
    }
}

// Function to check if the current user is an admin
async function CheckUserAccess() {
    const adminEmails = await fetchAdminEmails();

    return new Promise((resolve, reject) => {
        onAuthStateChanged(authUser, user => {
            if (user) {
                const userEmail = user.email;
                if (adminEmails.includes(userEmail)) {
                    console.log("Access granted to /admin path");
                    resolve('admin');
                } else {
                    console.log("Access denied to /admin path");
                    resolve('not-authorized');
                }
            } else {
                console.log("No user is signed in");
                resolve('not-signed-in');
            }
        }, error => {
            console.error("Error with onAuthStateChanged:", error);
            reject(error);
        });
    });
}
export { CheckUserAccess };