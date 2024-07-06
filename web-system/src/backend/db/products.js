import "firebase/firestore";
import { db } from "../firebase";
import { doc, setDoc, collection, getDocs, query, where, addDoc, updateDoc } from "firebase/firestore";

// Reference
const productRef = collection(db, "products");

// Functions

// Adding products
const addProduct = async (title, category, type, description, quantity, location, imageArray) => {
    try {
        const docRef = await addDoc(productRef, {
            title,
            category,
            type,
            description,
            quantity,
            location,
            images: imageArray,
        });
        await setDoc(docRef, { pid: docRef.id }, { merge: true });
        return docRef.id;
    } catch (e) {
        console.error("Error adding product:", e);
        throw new Error("Error adding product: " + e.message);
    }
};

// Updating a product
const updateProduct = async (id, updatedProduct) => {
    try {
        const productDocRef = doc(db, 'products', id);
        await updateDoc(productDocRef, updatedProduct);
    } catch (e) {
        console.error("Error updating product:", e);
        throw new Error("Error updating product: " + e.message);
    }
};

// Fetching all products
const fetchProducts = async () => {
    try {
        const qSnapshot = await getDocs(productRef);
        const productList = qSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return productList;
    } catch (e) {
        console.error("Error fetching products:", e);
        throw new Error("Error fetching products: " + e.message);
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
        throw new Error("Error fetching product: " + e.message);
    }
};

//count products
export const countProducts = async () => {
    const productsSnapshot = await getDocs(productRef);
    return productsSnapshot.size;
};

export { db, addProduct, updateProduct, fetchProducts, fetchSelectedProduct };



