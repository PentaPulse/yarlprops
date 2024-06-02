import React, { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { db, auth } from './secrets';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { addUser } from './db/users';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const q = query(collection(db, "systemusers"), where("email", "==", currentUser.email));
                    const querySnapshot = await getDocs(q);
                    if(!querySnapshot.empty){
                        const userDoc = querySnapshot.docs[0]
                        setUser({ ...userDoc.data(), ...currentUser });
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
    const google = () => signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            const userid = user.uid
            addUser(userid, "", "", user.email, user.phoneNumber, "", user.photoURL, "")
        })

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
