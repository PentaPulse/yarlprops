import "firebase/firestore";
import { db } from "../firebase";
import { doc, setDoc, collection, getDocs, query, where, addDoc, updateDoc, arrayUnion } from "firebase/firestore";

// Reference
const productRef = collection(db, "products");

// Adding products
const addProduct = async ({ merchantId, title, category, subCategory, description, quantity, location, status, images }) => {
    console.log(status)
    try {
        const docRef = await addDoc(productRef, {
            title,
            category,
            subCategory,
            description,
            quantity,
            location,
            status,
            images,
            merchantId,
            timestamp: new Date().toISOString()
        });
        await setDoc(docRef, { pid: docRef.id }, { merge: true });
        await updateDoc(doc(db, 'systemusers', merchantId), { myProducts: arrayUnion(docRef.id) })
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
        //if()
        const qSnapshot = await getDocs(productRef);
        const productList = qSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return productList;
    } catch (e) {
        return []
    }
};

// Fetching a specific product by ID
const fetchSelectedProduct = async (pid) => {
    const q = query(productRef, where('pid', '==', pid));
    try {
        const qSnapshot = await getDocs(q);
        if (!qSnapshot.empty) {
            const product = qSnapshot.docs[0];
            return { id: product.pid, ...product.data() };
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
export const fetchProductOrders = async(cid)=>{
    const q = query(productRef,where('customers','==',cid))
    try{
        const qsnapshot = await getDocs(q)
        const productOrders = qsnapshot.docs.map((doc)=>doc.data())
        if(productOrders.length===0) return []
        return productOrders;
    }catch(e){
        console.log(e)
    }
}

export { addProduct, updateProduct, fetchProducts, fetchSelectedProduct };