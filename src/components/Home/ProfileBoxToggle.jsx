import React, { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import {authUser} from '../../backend/autharization'
import { onAuthStateChanged } from "firebase/auth";

function ProfileBoxToggle({handleSigninButton}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authUser, (user) => {
            setUser(user);
        });

        return () => {
            unsubscribe();
        };
    }, []);
    const handleSignout = () => {
        authUser.signOut();
    };

    return (
        <div className='border'>
            {user ? (
                <>
                    <span>Sign in as: {user.displayName || user.email}</span>
                    <button onClick={handleSignout}>Sign out</button>
                </>
            ) : (
                <Button onClick={handleSigninButton} aria-controls='popup-window'>Sign in</Button>
            )}
        </div>
    );
}

export default ProfileBoxToggle