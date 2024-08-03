import * as React from 'react';
import { Button } from '@mui/material';
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { db, auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { addUser, addUserM, registerUser } from './db/users';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAlerts } from './AlertService';
import axios from 'axios'

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [dash, setDash] = React.useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const showAlerts = useAlerts();

    React.useEffect(() => {
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
                    
                }
            } else {
                setUser(null);
            }
            setLoading(false);

        });

        return () => unsubscribe();
    });

    //registering
    const register = (fname, lname, dname, email, password, role) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                const user = result.user;
                const userid = user.uid;
                updateProfile(user, { displayName: dname })
                    .then(() => {
                        registerUser(userid, fname, lname, dname, email, role);
                        addUserM(fname,lname,dname,email,role)
                    })
                    .catch((error) => {
                        console.error("Error updating profile:", error);
                    });
                showAlerts('Account created', 'success', 'top-center')
            })
            .catch((error) => {
                showAlerts('ww' + error, 'error')
                if (email === '' || password === '' || fname === '' || lname === '' || role === '') {
                    if (error.code === 'auth/invalid-email' || error.code === 'auth/missing-password') {
                        showAlerts('Enter details', 'warning')
                    }
                } else if (error.code === 'auth/invalid-email') {
                    showAlerts('Try different email', 'warning')
                }
                if (error.code === 'auth/email-already-in-use') {
                    showAlerts('Try different email', 'warning')
                }
                if (error.code === 'auth/weak-password') {
                    showAlerts('Try different password', 'warning')
                }
            });
    }

    //login
    const provider = new GoogleAuthProvider();
    const google = () => signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            const userid = user.uid
            
            addUser(userid, "", "", user.email, user.phoneNumber, "", user.photoURL, "")
            showAlerts('Successfully logged', 'success')
        })
        .catch(() => {
            showAlerts('Error occured , Try again with different gmail', 'error')
        })

    const login = (email, password) => signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            window.location.reload()
        })
        .catch((error) => {
            if (error.code === 'auth/invalid-email') {
                showAlerts('Invalid credentials', 'error')
            }
            if (error.code === 'auth/missing-password') {
                showAlerts('Enter your password', 'warning')
            }
            if (error.code === 'auth/invalid-credential') {
                showAlerts('Check email and password and try again', 'warning')
            }
        })

    //reset password
    const reset = (email) => sendPasswordResetEmail(auth, email)
        .then(() => {
            showAlerts(`Check ${email} inbox`, 'info')
        })
        .catch((error) => {
            if (error.code === 'auth/missing-email') {
                showAlerts('Enter your email address', 'warning')
            }
        })

    //logout
    const logout = () => signOut(auth)
        .then(() => {
            sessionStorage.clear()
        })

    //back to home
    const home = () => {
        navigate('/')
    }

    // dash on off
    React.useEffect(() => {
        // Update the state when the URL changes
        if (location.pathname === "/dashboard") {
            setDash(false)
        }
        else {
            setDash(true)
        }
    }, [location]);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && !user.emailVerified) {
                showAlerts(
                    <>
                        Verify your email <VerifyEmail />
                    </>,
                    'error',
                    'top-center'
                );
            }
        });
        return () => unsubscribe();
    });

    const VerifyEmail = () => {
        const verify = () => {
            sendEmailVerification(auth.currentUser)
                .then(() => {
                    showAlerts('Check your email inbox');
                })
                .catch((e) => {
                    console.log(e)
                })
        }
        return (
            <>
                <Button onClick={verify}>Verify now!</Button>
            </>
        )
    }

    return (
        <AuthContext.Provider value={{ user, register, login, logout, reset, google, home, dash }}>
            {loading ? '': children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext); 
