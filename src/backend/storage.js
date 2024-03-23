import firebase from "firebase/compat/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { firebaseConfig } from "./configs";

const app=firebase.initializeApp(firebaseConfig)
const storage = getStorage(app);

function uploadProfilePicture(user, pp) {
    const storageRef = ref(storage, `users/profilePictures/${user.uid}`);
    uploadBytes(storageRef, pp).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
            updateProfile((user), {
                photoURL: downloadURL,
            })
        })
    })
}

export { storage, uploadProfilePicture }