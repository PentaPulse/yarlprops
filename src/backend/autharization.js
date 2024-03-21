import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged} from "firebase/auth";
import 'firebase/compat/auth';
import { app } from "./configs";


const auth = app.auth;
const authUser = getAuth();

export { auth, authUser };

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