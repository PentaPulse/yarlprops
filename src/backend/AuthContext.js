import React, { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { db, auth } from './secrets';
import { doc, getDoc } from 'firebase/firestore';
import { addUser } from './db/users';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    // Get the user document using the UID
                    const userDocRef = doc(db, 'systemusers', currentUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        setUser({ ...userDoc.data(), ...currentUser });
                    } else {
                        console.error('No such user document!');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);
    //registering
    const register = (fname, lname, email, password,role) => createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
            const user = result.user;
            const userid = user.uid
            addUser(userid, fname, lname, email, "", "", "", "",role)
        })

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
        <AuthContext.Provider value={{ user, register, login, logout, reset, google }}>
            {loading ? "" : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
