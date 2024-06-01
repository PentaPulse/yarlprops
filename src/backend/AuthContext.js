import React, { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { db, auth } from './secrets';
import { collection,  getDocs, query,  where } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const q = query(collection(db, 'systemUsers'), where('email', '==', currentUser.email))
                const userDocs = await getDocs(q);
                if (!userDocs.empty) {
                    const userDoc = userDocs.docs[0]
                    setUser({ ...currentUser, ...userDoc.data() });
                }

            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);
    //registering


    //login
    const provider = new GoogleAuthProvider();
    const google = () => signInWithPopup(auth, provider)//.then(()=>window.location.reload(0))

    const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
    //reset password
    const reset = (email) => sendPasswordResetEmail(auth, email)
        .then(alert("check " + email + " inbox"));
    //logout
    const logout = () => signOut(auth);

    return (
        <AuthContext.Provider value={{ user, login, logout, reset, google }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
