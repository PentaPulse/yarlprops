import "firebase/firestore";
import { db } from "../firebase";
import { doc, setDoc, collection, getDocs, query, where, addDoc, updateDoc, arrayUnion, limit, orderBy } from "firebase/firestore";
import { addItemByMerchant } from "./logsManager";


const productRef = collection(db, "products");


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
            visibility: false,
            createdAt: new Date().toISOString()
        });
        await setDoc(docRef, { pid: docRef.id }, { merge: true });
        await updateDoc(doc(db, 'systemusers', merchantId), { myProducts: arrayUnion(docRef.id) })
        await addItemByMerchant(merchantId, title, docRef.id, 'product')
        return docRef.id;
    } catch (e) {
        console.error("Error adding product:", e);
        throw new Error("Error adding product: " + e.message);
    }
};


const updateProduct = async (id, updatedProduct) => {
    try {
        const productDocRef = doc(db, 'products', id);
        await updateDoc(productDocRef, { ...updatedProduct, id: id, updatedAt: new Date().toISOString() });
    } catch (e) {
        console.error("Error updating product:", e);
        throw new Error("Error updating product: " + e.message);
    }
};


export const fetchProducts = async (props) => {
    try {
        const { location, userId } = props; 
        let q;

        if (location === 'home') {            
            q = query(productRef, where('visibility', '==', true), limit(4));
        } else if (location === 'dash' && userId) {            
            q = query(productRef, where('merchantId', '==', userId),);
        } 

        const qSnapshot = await getDocs(q);
        const productList = qSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return productList;
    } catch (e) {
        console.error("Error fetching products:", e);
        return [];
    }
};


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


export const countProducts = async () => {
    const productsSnapshot = await getDocs(productRef);
    return productsSnapshot.size;
};
export const fetchProductOrders = async (cid) => {
    const q = query(productRef, where('customers', '==', cid))
    try {
        const qsnapshot = await getDocs(q)
        const productOrders = qsnapshot.docs.map((doc) => doc.data())
        if (productOrders.length === 0) return []
        return productOrders;
    } catch (e) {
        console.log(e)
    }
}

export { addProduct, updateProduct, fetchSelectedProduct };