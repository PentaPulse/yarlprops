import * as React from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { db, auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { registerAdmin } from './db/users';
import { useNavigate } from 'react-router-dom';
import { useAlerts } from './AlertService';
import { signinLog, signoutLog } from './db/logs';
//import { welcomeNotification } from './db/notificationsManager';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate()
    const { showAlerts2 } = useAlerts();

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const adminDocRef = doc(db, 'admins', currentUser.uid);
                    const adminDoc = await getDoc(adminDocRef)
                    if (adminDoc.exists()) {
                        setUser({ ...adminDoc.data(), ...currentUser })
                    }
                    sessionStorage.setItem('pp', currentUser.photoURL);
                    sessionStorage.setItem('displayName', currentUser.displayName);
                } catch (error) {

                }
            } else {
                setUser(null);
            }
            setLoading(false);

        });

        return () => unsubscribe();
    }, []);

    const checkUserExistence = async (userId) => {
        const adminDocRef = doc(db, 'admins', userId);
        const adminDoc = await getDoc(adminDocRef)
        const userDocRef = doc(db, 'systemusers', userId);
        const userDoc = await getDoc(userDocRef);
        if (adminDoc.exists() || userDoc.exists()) {
            return true
        } else {
            return false
        }
    }

    //registering
    const register = async ( firstName, lastName, displayName,email, password) => {
        await createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                const user = result.user;
                updateProfile(user, { displayName: displayName })
                    .then(() => {
                        registerAdmin(user.uid, firstName, lastName, displayName, email).then((result) => {
                            if (result.success) {
                                sessionStorage.setItem('pp', user.photoURL);
                                sessionStorage.setItem('displayName', user.displayName);
                            }
                        })
                    })
                //welcomeNotification(user)
                showAlerts2('Account created , wait a little ', 'success', 'top-center')
                signinLog(user.uid, { method: 'signup' })
            })
            .catch((error) => {
                //showAlerts2('ww' + error, 'error')
                if (email === '' || password === '' || firstName === '' || lastName === '') {
                    if (error.code === 'auth/invalid-email' || error.code === 'auth/missing-password') {
                        showAlerts2('Enter details', 'warning')
                    }
                } else if (error.code === 'auth/invalid-email') {
                    showAlerts2('Try different email', 'warning')
                }
                if (error.code === 'auth/email-already-in-use') {
                    showAlerts2('Try different email', 'warning')
                }
                if (error.code === 'auth/weak-password') {
                    showAlerts2('Try different password', 'warning')
                }
            });
    }

    //login    
    const provider = new GoogleAuthProvider();
    const google = () => signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            if (!checkUserExistence(user.uid)) {
                registerAdmin(user.uid, '', '', user.displayName, user.email)
            }
            signinLog(user.uid, { method: 'google' });
            sessionStorage.setItem('pp', user.photoURL);
            sessionStorage.setItem('displayName', user.displayName);
        })
        .catch(() => {
            showAlerts2('Error occured , Try again with different gmail', 'error')
        })

    const login = (email, password) => signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
            const user = result.user
            sessionStorage.setItem('pp', user.photoURL);
            sessionStorage.setItem('displayName', user.displayName);
            signinLog(user.uid, { method: 'email&password' })
            showAlerts2('Successfully logged', 'success')
        })
        .catch((error) => {
            if (error.code === 'auth/invalid-email') {
                showAlerts2('Invalid credentials', 'error')
            }
            if (error.code === 'auth/missing-password') {
                showAlerts2('Enter your password', 'warning')
            }
            if (error.code === 'auth/invalid-credential') {
                showAlerts2('Check email and password and try again', 'warning')
            }
        })

    //reset password
    const reset = (email) => sendPasswordResetEmail(auth, email)
        .then(() => {
            //resetLog(user.uid) //no user object returning
            showAlerts2(`Check ${email} inbox`, 'info')
        })
        .catch((error) => {
            if (error.code === 'auth/missing-email') {
                showAlerts2('Enter your email address', 'warning')
            }
            console.error(error)
        })

    //logout
    const logout = () => signOut(auth)
        .then(() => {
            signoutLog(user.uid)
            const the = sessionStorage.getItem('isLight');
            sessionStorage.clear();
            sessionStorage.setItem('isLight', the)
        })

    //back to home
    const home = () => {
        navigate('/')
    }

    /*
        React.useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user && !user.emailVerified) {
                    showAlerts2(
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
                        showAlerts2('Check your email inbox');
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
            {loading ? '' : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext); 