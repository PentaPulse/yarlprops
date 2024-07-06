import * as React from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { db, auth } from './secrets';
import { doc, getDoc } from 'firebase/firestore';
import { addUser } from './db/users';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [dash, setDash] = React.useState(false)
    const navigate = useNavigate()
    const location = useLocation()

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
    const register = (fname, lname, dname, email, password, role) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                const user = result.user;
                const userid = user.uid;
                updateProfile(user, { displayName: dname })
                    .then(() => {
                        addUser(userid, fname, lname, email, "", "", "", "", role);
                    })
                    .catch((error) => {
                        console.error("Error updating profile:", error);
                    });
            })
            .catch((error) => {
                console.error("Error creating user:", error);
            });
        }

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

    //back to home
    const home = () => {
        sessionStorage.setItem('dash', !sessionStorage.getItem('dash'))
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
    
    return (
        <AuthContext.Provider value={{ user, register, login, logout, reset, google, home, dash }}>
            {loading ? "" : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);