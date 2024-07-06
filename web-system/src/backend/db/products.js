import "firebase/firestore";
import { db } from "../firebase";
import { doc, setDoc, collection, getDocs, query, where, addDoc, updateDoc } from "firebase/firestore";

//reference
const productRef = collection(db, "products")


//functions
// adding products
const addProduct = async (title, category, type, description, quantity, location, imageArray) => {
    try {
        const docRef = await addDoc(productRef, {
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
        console.error("Error adding product:", e);
        throw new Error(e);
    }
};

//Updating a Product
const updateProduct = async (id, updatedProduct) => {
    try {
        const productDocRef = doc(db, 'products', id);
        await updateDoc(productDocRef, updatedProduct);
    } catch (e) {
        console.error("Error updating product:", e);
        throw new Error(e);
    }
};

// Fetching all products
const fetchProducts = async () => {
    try {
        const qSnapshot = await getDocs(productRef);
        const productList = qSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return productList;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

// Fetching a specific product by ID
const fetchSelectedProduct = async (pid) => {
    const q = query(productRef, where('pid', '==', pid));
    try {
        const qSnapshot = await getDocs(q);
        if (!qSnapshot.empty) {
            const product = qSnapshot.docs[0];
            return { id: product.id, ...product.data() };
        } else {
            console.log("No such product!");
            return null;
        }
    } catch (e) {
        console.error("Error fetching product:", e);
        return null;
    }
};

//fetching all the documents without conditions
// const fetchProducts = async () => {
//     try {
//         const qSnapshot = await getDocs(productRef);
//         const productList = qSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         return productList;
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         return [];
//     }
// }

// fetch documents with conditions / applying filters


//fetching readmore clicked document
// const fetchSelectedProduct = async (pid) => {
//     const q = query(productRef, where('pid', '==', pid))
//     try {
//         const qSnapshot = await getDocs(q)
//         const product = qSnapshot.docs[0]
//         return product.data();
//     } catch (e) {
//         console.error("Error fetching product: ", e);
//         return [];
//     }
// }

//count products
export const countProducts = async () => {
    const productsSnapshot = await getDocs(productRef);
    return productsSnapshot.size;
};

export { db, addProduct, updateProduct, fetchProducts, fetchSelectedProduct }