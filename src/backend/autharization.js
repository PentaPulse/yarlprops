import firebase from "firebase/compat/app";
import { useState, useEffect } from "react";
import { getAuth} from "firebase/auth";
import 'firebase/compat/auth';
import { firebaseConfig } from "./secrets";

firebase.initializeApp(firebaseConfig)
const authUser = getAuth();

export {  authUser };

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = authUser.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });

        // Cleanup function to unsubscribe when component unmounts
        return () => unsubscribe();
    }, []);

    const signOut = () => {
        return authUser.signOut()
    };

    return { currentUser, signOut };
};