import firebase from "firebase/compat/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { firebaseConfig } from "./secrets";

const app=firebase.initializeApp(firebaseConfig)
const storage = getStorage(app);
/*
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

updateProfile(user, {
                    displayName: displayName,
                }).then(() => {
                    if (pp) {
                        const storageRef = ref(storage, `users/${user.uid}/profilePicture`);
                        uploadBytes(storageRef, pp).then((snapshot) => {
                            getDownloadURL(snapshot.ref).then((downloadURL) => {
                                updateProfile((user), {
                                    photoURL: downloadURL,
                                }).then(() => {
                                    window.location.reload(0);
                                })
                            })
                        })
                    } else {
                        navigate('/')
                    }
                })
*/

const uploadImagesAndGetUrls = async (files, folderPath) => {
    const uploadPromises = files.map(file => {
        const storageRef = ref(storage, `${folderPath}/${file.name}`);
        return uploadBytes(storageRef, file).then(async snapshot => {
            return await getDownloadURL(snapshot.ref);
        });
    });
    return Promise.all(uploadPromises);
};

export { storage, uploadImagesAndGetUrls }