import * as React from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { db, auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { registerUser } from './db/users';
import { useNavigate } from 'react-router-dom';
import { useAlerts } from './AlertService';
import { signinLog, signoutLog } from './db/logsManager';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [ok, setOk] = React.useState(false)
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
    }, [ok]);

    const checkUserExistence = async (userId) => {
        const userDocRef = doc(db, 'systemusers', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return true
        } else {
            return false
        }
    }

    //login    
    const provider = new GoogleAuthProvider();
    const google = () => signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            if (!checkUserExistence(user.uid)) {
                registerUser(user.uid, '', '', user.displayName, user.email).then((result) => {
                    if (result.success) {
                        setOk(true)
                    }
                })
            }
            signinLog(user.uid, { method: 'google' });
            sessionStorage.setItem('pp', user.photoURL);
            sessionStorage.setItem('displayName', user.displayName);
        })
        .catch(() => {
            showAlerts('Error occured , Try again with different gmail', 'error')
        })

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
        <AuthContext.Provider value={{ user, login, logout, reset, google, home }}>
            {loading ? '' : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext); 