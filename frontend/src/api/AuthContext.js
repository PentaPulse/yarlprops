import * as React from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged,  sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { db, auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import {  registerUser } from './db/users';
import {  useNavigate } from 'react-router-dom';
import { useAlerts } from './AlertService';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [ok,setOk]=React.useState(false)
    const navigate = useNavigate()
    const showAlerts = useAlerts();

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userDocRef = doc(db, 'systemusers', currentUser.uid);
                    const adminDocRef = doc(db,'admins',currentUser.uid);
                    const adminDoc = await getDoc(adminDocRef)
                    const userDoc = await getDoc(userDocRef);
                    if(adminDoc.exists()){
                        setUser({ ...adminDoc.data(), ...currentUser})
                    }
                    else if (userDoc.exists()) {
                        setUser({ ...userDoc.data(), ...currentUser });
                    }
                } catch (error) {
                    
                }
            } else {
                setUser(null);
            }
            setLoading(false);

        });

        return () => unsubscribe();
    },[ok]);

    //registering
    const register = async(fname, lname, dname, email, password) => {
        await createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                const user = result.user;
                const userid = user.uid;
                updateProfile(user, { displayName: dname })
                    .then(() => {
                        registerUser(userid, fname, lname, dname, email).then((result)=>{
                            if(result.success){
                                sessionStorage.setItem('pp', user.photoURL);
                                sessionStorage.setItem('displayName', user.displayName);
                                setOk(true)
                            }
                        })
                    })/*
                    .catch((error) => {
                        console.error("Error updating profile:", error);
                    });*/
                showAlerts('Account created , wait a little ', 'success', 'top-center')
            })
            .catch((error) => {
                //showAlerts('ww' + error, 'error')
                if (email === '' || password === '' || fname === '' || lname === '' ) {
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
            sessionStorage.setItem('pp', user.photoURL);
            sessionStorage.setItem('displayName', user.displayName);
            registerUser(user.uid, '', '', user.displayName, user.email).then((result)=>{
                if(result.success){
                    setOk(true)
                }
            })
        })
        .catch(() => {
            showAlerts('Error occured , Try again with different gmail', 'error')
        })

    const login = (email, password) => signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
            const user = result.user
            sessionStorage.setItem('pp', user.photoURL);
            sessionStorage.setItem('displayName', user.displayName);
            showAlerts('Successfully logged', 'success')
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
            const the = sessionStorage.getItem('isLight');
            sessionStorage.clear();
            sessionStorage.setItem('isLight',the)
        })

    //back to home
    const home = () => {
        navigate('/')
    }
    
/*
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
*/
    return (
        <AuthContext.Provider value={{ user, register, login, logout, reset, google, home }}>
            {loading ? '': children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext); 