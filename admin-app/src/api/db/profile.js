import { auth, db, storage } from '../firebase' // Import your Firebase config
import {
    updateEmail,
    updatePassword,
    updatePhoneNumber,
    PhoneAuthProvider,
    updateProfile,
    EmailAuthProvider,
    reauthenticateWithCredential,
    RecaptchaVerifier,
    sendPasswordResetEmail,
    sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Swal from 'sweetalert2';

////-------------------- Profile Info Functions --------------------////

export const uploadProfilePictureToStorage = async (file, user, setProgress, setLoading, setFile, setPreview) => {
    // This function handles uploading the file to Firebase Storage
    if (!file) return;
    setLoading(true);
    const storageRef = ref(storage, `${user.uid}/profile_pictures/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        'state_changed',
        (snapshot) => {
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
        },
        (error) => {
            console.error('Upload error:', error);
            setLoading(false);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                updateProfile(auth.currentUser, { photoURL: downloadURL })
                    .then(() => {
                        sessionStorage.removeItem('pp')
                        sessionStorage.setItem('pp', downloadURL)
                        setFile(null);
                        setPreview(null);
                        setLoading(false);
                    })
                    .catch((error) => console.error('Update profile error:', error));
            });
        }
    );
};

////-------------------- Profile Settings Functions --------------------////

// Update Profile Information Function
export const updateProfileInfo = async (user, profileData) => {
    try {
        const userDocRef = doc(db, "admins", user.uid);
        await updateDoc(userDocRef, profileData); // Update Firestore
        await updateProfile(auth.currentUser, { displayName: profileData.name }); // Update Firebase Auth Profile
        return "Profile updated successfully";
    } catch (error) {
        throw new Error("Error updating profile: " + error.message);
    }
};

// Fetch Profile Information Function
export const fetchProfileInfo = async (user) => {
    try {
        const userDocRef = doc(db, "admins", user.uid);
        const docSnapshot = await getDoc(userDocRef);

        if (!docSnapshot.exists()) {
            throw new Error("Profile not found");
        }

        return docSnapshot.data();
    } catch (error) {
        throw new Error("Error fetching profile information: " + error.message);
    }
};

////-------------------- Account Settings Functions --------------------////

// Change Email Function
export const changeEmail = async (user, email) => {
    if (auth.currentUser.email !== email.old) {
        Swal.fire({
            icon: 'error',
            title: 'Emails Mismatch',
            text: `Entered email doesn't match the existing email: ${auth.currentUser.email}`,
        });
        return;
    }

    if (!email.new || !email.confirm) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Information',
            text: 'Both new email and confirm email are required.',
        });
        return;
    }

    if (email.new !== email.confirm) {
        Swal.fire({
            icon: 'error',
            title: 'Emails Do Not Match',
            text: 'New email and confirm email must match. Please check and try again.',
        });
        return;
    }

    try {
        // Prompt user for their password
        const { value: password } = await Swal.fire({
            title: 'Reauthenticate',
            text: 'Enter your current password to proceed.',
            input: 'password',
            inputPlaceholder: 'Enter your password',
            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off',
            },
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Submit',
        });

        if (!password) {
            Swal.fire({
                icon: 'info',
                title: 'Action Canceled',
                text: 'Password is required to reauthenticate.',
            });
            return;
        }

        // Reauthenticate the user
        const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
        await reauthenticateWithCredential(auth.currentUser, credential);

        // Send verification email to the new email address
        await sendEmailVerification(auth.currentUser);

        // Notify user about the verification email
        const { isConfirmed } = await Swal.fire({
            icon: 'info',
            title: 'Verification Email Sent',
            text: 'A verification email has been sent to your new email address. Please verify it before updating.',
            confirmButtonText: 'I Verified',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
        });

        if (!isConfirmed) {
            Swal.fire({
                icon: 'error',
                title: 'Verification Required',
                text: 'You must verify your new email before continuing.',
            });
            return;
        }

        // Reload the user's state and check email verification status
        await auth.currentUser.reload();
        if (!auth.currentUser.emailVerified) {
            Swal.fire({
                icon: 'error',
                title: 'Not Verified',
                text: 'Email verification is not yet complete. Please verify your email and try again.',
            });
            return;
        }

        // Update email in Firebase Authentication
        await updateEmail(auth.currentUser, email.new);

        // Update email in Firestore
        await updateDoc(doc(db, 'admins', user.uid), { email: email.new });

        Swal.fire({
            icon: 'success',
            title: 'Email Updated',
            text: 'Your email has been updated successfully.',
        });

        return 'Email updated successfully';
    } catch (error) {
        console.error('Error updating email:', error.message);

        Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: `Error updating email: ${error.message}`,
        });

        throw new Error('Error updating email: ' + error.message);
    }
};

// Change Phone Number Function
export const changePhoneNumber = async (user, phoneNumber) => {
    try {
        // Create a temporary invisible container for RecaptchaVerifier
        const recaptchaContainerId = "recaptcha-container";
        let container = document.getElementById(recaptchaContainerId);
        if (!container) {
            container = document.createElement("div");
            container.id = recaptchaContainerId;
            document.body.appendChild(container); // Append to the body
        }

        // Initialize the RecaptchaVerifier
        const recaptchaVerifier = new RecaptchaVerifier(
            recaptchaContainerId,
            {
                size: "invisible", // Invisible reCAPTCHA
                callback: (response) => {
                    console.log("reCAPTCHA verified:", response);
                },
                "expired-callback": () => {
                    console.warn("reCAPTCHA expired. Please try again.");
                },
            },
            auth
        );

        // Request OTP using the new phone number
        const verificationId = await PhoneAuthProvider.verifyPhoneNumber(
            phoneNumber.new,
            recaptchaVerifier
        );

        // Prompt the user for the verification code sent to the new phone number
        const verificationCode = prompt("Enter the verification code sent to your new phone number:");
        if (!verificationCode) {
            throw new Error("Verification code is required.");
        }

        // Verify the OTP and get the credential
        const credential = PhoneAuthProvider.credential(verificationId, verificationCode);

        // Update the phone number in Firebase Authentication
        await updatePhoneNumber(auth.currentUser, credential);

        // Update the phone number in Firestore
        await updateDoc(doc(db, "admins", user.uid), { phoneNumber: phoneNumber.new });

        return "Phone number updated successfully.";
    } catch (error) {
        console.error("Error updating phone number:", error.message);
        throw new Error("Error updating phone number: " + error.message);
    } finally {
        // Clean up the temporary reCAPTCHA container
        const container = document.getElementById("recaptcha-container");
        if (container) {
            container.remove();
        }
    }
};

// Change Password Function
export const changePassword = async (password) => {
    if (password.new !== password.confirm) {
        Swal.fire({
            icon: "error",
            title: "Password Mismatch",
            text: "New password and confirm password do not match",
        });
        return;
    }

    const user = auth.currentUser;

    if (!user) {
        Swal.fire({
            icon: "error",
            title: "No User Signed In",
            text: "Please sign in to change your password.",
        });
        return;
    }

    try {
        console.log(user.email)
        console.log(password.old)
        // Create credentials using the current password for reauthentication
        const credential = EmailAuthProvider.credential(user.email, password.old).then((r) => console.error(r))

        console.log(credential)
        // Reauthenticate the user
        await reauthenticateWithCredential(user, credential);

        console.log(password.confirm)
        console.log(user)
        // Update the password after successful reauthentication
        await updatePassword(user, password.confirm);

        Swal.fire({
            icon: "success",
            title: "Password Updated",
            text: "Your password has been updated successfully.",
        });
        return "Password updated successfully";
    } catch (error) {
        // Handle Firebase errors
        let errorMessage = "An error occurred. Please try again.";
        console.log(error)
        switch (error.code) {
            case "auth/invalid-credential":
                errorMessage = "The current password you entered is incorrect.";
                break;
            case "auth/weak-password":
                errorMessage = "The new password is too weak. Please choose a stronger password.";
                break;
            case "auth/too-many-requests":
                errorMessage = "Too many attempts. Please try again later.";
                break;
            case "auth/user-not-found":
                errorMessage = "User not found. Please check your credentials.";
                break;
            default:
                errorMessage = error.message || "Unknown error occurred.";
        }

        Swal.fire({
            icon: "error",
            title: "Error Updating Password",
            text: errorMessage,
        });
    }
};

export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return "Password reset email sent successfully. Please check your inbox.";
    } catch (error) {
        console.error("Error resetting password:", error.message);
        throw new Error("Error resetting password: " + error.message);
    }
};