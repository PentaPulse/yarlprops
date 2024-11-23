import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const fetchFilters = async (itemType, searchParams) => {
  const searchTerm = searchParams.get("search");
  const category = searchParams.get("category");
  const subCategory = searchParams.get("subcategory");
  const quantity = searchParams.get("quantity");

  const itemRef = collection(db, itemType);

  try {
    let conditions = [where("visibility", "==", true)];

    if (searchTerm) {
      const searchValue = searchTerm.toLowerCase(); // Or another consistent transformation
      conditions.push(
        where("title", ">=", searchValue),
        where("title", "<=", searchValue + "\uf8ff")
      );
    }

    if (category && !subCategory) {
      conditions.push(where("category", "==", category));
    }

    if (subCategory) {
      conditions.push(where("subCategory", "==", subCategory));
    }

    if (quantity) {
      conditions.push(where("quantity", "==", quantity));
    }

    const q = query(itemRef, ...conditions);

    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => doc.data());

    return items;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const fetchItems = async (props) => {
    try {
        const {itemType, location, userId } = props; 
        let q;
        const itemRef = collection(db,itemType)

        if (location === 'home') {            
            q = query(itemRef, where('visibility', '==', true), limit(4));
        } else if (location === 'dash' && userId) {            
            q = query(itemRef, where('merchantId', '==', userId),);
        } 

        const qSnapshot = await getDocs(q);
        const productList = qSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return productList;
    } catch (e) {
        console.error("Error fetching rentals:", e);
        return [];
    }
};

export const fetchAllItems = async () => {
  try {
    const collections = ["products", "rentals", "services"];
    const itemList = [];

    for (const col of collections) {
      const querySnapshot = await getDocs(query(collection(db, col),where('visibility','==',true)));
      querySnapshot.docs.forEach((doc) => {
        const item = doc.data();
        itemList.push({
          title: item.title,
          type: col,
          id: item[`${col.charAt(0).toLowerCase()}id`], 
        });
      });
    }

    return itemList;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};