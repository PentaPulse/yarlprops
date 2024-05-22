import firebase from "firebase/compat/app";
import "firebase/firestore";
import { firebaseConfig } from "../secrets";
import { doc, setDoc, getFirestore, collection, getDocs, query, where } from "firebase/firestore";

const app = firebase.initializeApp(firebaseConfig)

const db = getFirestore(app);
//reference
const productRef = collection(db, "products")


//functions
// adding products
const addProduct = async (productId, name, type, subtype, location, price, description) => {
    await setDoc(doc(productRef, productId), {
        name: name,
        type: type,
        subtype: subtype,
        location: location,
        price: price,
        description: description
    })
}

//fetching all the documents without conditions
const fetchProducts = async () => {
    try {
        const qSnapshot = await getDocs(productRef);
        const productList = qSnapshot.docs.map(doc => doc.data());
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
        return []
    }
}
export { addProduct, fetchProducts, fetchSelectedProduct }