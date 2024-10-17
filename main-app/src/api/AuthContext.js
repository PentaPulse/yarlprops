import * as React from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { db, auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { registerUser } from './db/users';
import { useNavigate } from 'react-router-dom';
import { useAlerts } from './AlertService';
import { signinLog, signoutLog } from './db/logsManager';
import { welcomeNotification } from './db/notificationsManager';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate()
    const { showAlerts } = useAlerts();

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userDocRef = doc(db, 'systemusers', currentUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        setUser({ ...userDoc.data(), ...currentUser });
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
        const userDocRef = doc(db, 'systemusers', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            console.log("user existed")
            return true
        } else {
            console.log("user not existed")
            return false
        }
    }

    //register
    const register = async (email, password, firstName, lastName, displayName) => {
        await createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                const user = result.user;
                updateProfile(user, { displayName: displayName })
                    .then(() => {
                        registerUser(user.uid, firstName, lastName, displayName, email).then((result) => {
                            if (result.success) {
                                sessionStorage.setItem('pp', user.photoURL);
                                sessionStorage.setItem('displayName', user.displayName);
                            }
                        })
                    })
                welcomeNotification(user)
                showAlerts('Account created , wait a little ', 'success', 'top-center')
            })
            .catch((error) => {
                //showAlerts('ww' + error, 'error')
                if (email === '' || password === '' || firstName === '' || lastName === '') {
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

    const google = () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;

                // Check if the user exists in the database
                const userExists = await checkUserExistence(user.uid);
                if (!userExists) {
                    // Register the user if not already present
                    await registerUser(user.uid, '', '', user.displayName, user.email);
                }

                // Log the sign-in method
                await signinLog(user.uid, { method: 'google' });

                // Store user data in sessionStorage
                sessionStorage.setItem('pp', user.photoURL);
                sessionStorage.setItem('displayName', user.displayName);
                showAlerts('Successfully logged', 'success')
            })
            .catch((error) => {
                console.error('Google sign-in error:', error);
                showAlerts('Error occurred. Try again with a different Gmail.', 'error');
            });
    };

    const login = (email, password) => signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
            const user = result.user
            sessionStorage.setItem('pp', user.photoURL);
            sessionStorage.setItem('displayName', user.displayName);
            signinLog(user.uid, { method: 'email&password' })
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
            //resetLog(user.uid) //no user object returning
            showAlerts(`Check ${email} inbox`, 'info')
        })
        .catch((error) => {
            if (error.code === 'auth/missing-email') {
                showAlerts('Enter your email address', 'warning')
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
            {loading ? '' : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext); 