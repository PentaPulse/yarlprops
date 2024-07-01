import firebase from "firebase/compat/app";
import "firebase/firestore";
import { firebaseConfig } from "../secrets";
import { setDoc, getFirestore, collection, getDocs, query, where, addDoc } from "firebase/firestore";

const app = firebase.initializeApp(firebaseConfig)

const db = getFirestore(app);
//reference
const productRef = collection(db, "products")


//functions
// adding products
const addProduct = async (title, category, type, description, quantity, location, imageArray) => {
    try {
        const docRef = await addDoc(collection(db, 'products'), {
            title: title,
            category: category,
            type: type,
            description: description,
            quantity: quantity,
            location: location,
            images: imageArray,
        })
        await setDoc(docRef, { pid: docRef.id }, { merge: true });
        return docRef.id;

    } catch (e) {
        console.error(e)
    }
};

//fetching all the documents without conditions
const fetchProducts = async () => {
    try {
        const qSnapshot = await getDocs(productRef);
        const productList = qSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return productList;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

// fetch documents with conditions / applying filters


//fetching readmore clicked document
const fetchSelectedProduct = async (pid) => {
    const q = query(productRef, where('pid', '==', pid))
    try {
        const qSnapshot = await getDocs(q)
        const product = qSnapshot.docs[0]
        return product.data();
    } catch (e) {
        console.error("Error fetching product: ", e);
        return [];
    }
}

//count products
export const countProducts = async () => {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    return productsSnapshot.size;
};

export { db, addProduct, fetchProducts, fetchSelectedProduct }