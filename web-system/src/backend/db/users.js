import "firebase/firestore";
import { db } from "../firebase";
import { doc, setDoc, collection, getDoc, getDocs, where, query } from "firebase/firestore";

//reference
const userRef = collection(db, "systemusers")

//functions
//register user
export const registerUser=async(uid,fname,lname,dname,email,role)=>{
    try{
        const newUserRef = doc(db,"systemusers",uid);
        const userSnap=await getDoc(newUserRef);
        if(!userSnap.exists){
            await setDoc(newUserRef,{
                uid: uid,
                fname: fname,
                lname: lname,
                email: email,
                phone: '',
                gender: '',
                picture: '',
                address: '',
                role: role
            })
        }
    }
    catch(e){
        alert(e)
    }
}

export const addUser = async (uid, fname, lname, email, phone, gender, picture, address,role) => {
    try {
        const userRef = doc(db, 'systemusers', uid);
        const userSnap = await getDoc(userRef)
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: uid,
                fname: fname,
                lname: lname,
                email: email,
                phone: phone,
                gender: gender,
                picture: picture,
                address: address,
                role: role
            });
        } else {
            console.log("user exists")
        }

    } catch (e) {
        console.error('Error adding user: ', e);
    }
};


// fetching lists
export const fetchUserList = async () => {
    try {
        const querySnapshot = await getDocs(userRef);
        const usersList = querySnapshot.docs.map(doc => doc.data());
        return usersList;
    } catch (error) {
        console.error("Error fetching user emails:", error);
        return [];
    }
}

//counts
async function countUsersFromRef(Ref) {
    try {
        const querySnapshot = await getDocs(Ref);
        return querySnapshot.size;
    } catch (error) {
        console.error("Error fetching user count:", error);
        return 0;
    }
}

export const countUsers = async () => {
    const usersRef = collection(db, 'systemusers');
    return await countUsersFromRef(usersRef);
};

export const countSellers = async () => {
    const userRef = query(collection(db, 'systemusers'), where('role', '==', 'seller'));
    return await countUsersFromRef(userRef);
};

export const countRenters = async () => {
    const userRef = query(collection(db, 'systemusers'), where('role', '==', 'renter'));
    return await countUsersFromRef(userRef);
};