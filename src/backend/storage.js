import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "./configs";
import { updateProfile } from "firebase/auth";

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