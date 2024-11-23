import { addDoc, collection, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase";

//FOR CUSTOMERS
export const fetchOrderCount = async (custId, status) => {
  try {
    const q = query(
      collection(db, "orders"),
      where('custId', '==', custId),
      where('status', '==', status)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (e) {
    console.log("Error fetching count:", e);
    return 0;
  }
};

export const fetchFeedbackCount = async (custid) => {
  try {
    const q = query(
      collection(db, "orders"),
      where('custid', '==', custid),
      where('review', '==', false)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (e) {
    console.log("Error fetching count:", e);
    return 0;
  }
};

export const fetchOrders = async (custid) => {
  try {
    const q = await getDocs(query(collection(db, 'orders'), where('custId', '==', custid)))
    const data = q.docs.map((doc) => doc.data())
    return data;
  } catch (e) {
    console.log('error fetch o hist :- ', e)
  }
}

//FOR MERCHANTS
export const fetchCustomerOrders = async (merchid, itemType, itemId) => {
  try {
    const q = await getDocs(query(collection(db, 'orders'), where('merchid', '==', merchid), where('itemType', '==', itemType), where('itemId', '==', itemId)))
    const data = q.docs.map((doc) => doc.data())
    return data
  } catch (e) {
    console.log('error fetching merch orders :- ', e)
  }
}

//FOR BOTH CUSTS AND MERCHANTS
export const addOrder = async (cust, itemId, itemImage, title, itemType, itemQuantity, merchId, merchName) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("custId", "==", cust.uid),
      where("itemId", "==", itemId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { success: false };
    }
    const order = {
      itemId,
      itemImage,
      title,
      itemType,
      itemQuantity,
      merchId,
      merchName,
      status: "pending",
      custId: cust.uid,
      custName: cust.displayName,
      date: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "orders"), order);
    setDoc(docRef, { id: docRef.id }, { merge: true })
    return { success: true }
  } catch (e) {
    console.log("add order error: ", e);
  }
};

export const fetchOrdersForItem = async (itemId, merchId) => {
  const q = await getDocs(collection(db, 'orders'), where('merchId', '==', merchId))
  const orders = q.docs.map((doc) => doc.data())

  return orders.filter(order => order.itemId === itemId);
}

export const fetchProductsToOrders = async (merchId) => {
  const q = await getDocs(collection(db, 'products'), where('merchId', '==', merchId))
  const data = q.docs.map((doc) => doc.data())
  return data
}
export const fetchRentalsToOrders = async (merchId) => {
  const q = await getDocs(collection(db, 'rentals'), where('merchId', '==', merchId))
  const data = q.docs.map((doc) => doc.data())
  return data
}
export const fetchServicesToOrders = async (merchId) => {
  const q = await getDocs(collection(db, 'services'), where('merchId', '==', merchId))
  const data = q.docs.map((doc) => doc.data())
  return data
}

export const approveOrder = async (order) => {
  const q = query(
    collection(db, 'orders'),
    where('merchId', '==', order.merchId),
    where('custId', '==', order.custId),
    where('itemId', '==', order.itemId)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (doc) => {
    const docRef = doc.ref;

    await setDoc(docRef, { status: 'completed' }, { merge: true });

    const itemQuery = query(
      collection(db, order.itemType),
      where(`${order.itemType.charAt(0)}id`, '==', order.itemId)
    );

    const itemSnapshot = await getDocs(itemQuery);

    itemSnapshot.forEach(async (itemDoc) => {
      const itemRef = itemDoc.ref;
      const currentQuantity = itemDoc.data().quantity;

      if (currentQuantity > 0) {
        const updatedQuantity = currentQuantity - 1;

        const newStatus = updatedQuantity === 0 ? 'Sold out'  : itemDoc.data().status;
        const soldOutBy = updatedQuantity ===0 && new Date()
        await setDoc(itemRef, {
          quantity: updatedQuantity,
          status: newStatus,
          soldOutBy:soldOutBy
        }, { merge: true });

      } else {
        await setDoc(itemRef, { status: 'Sold out' }, { merge: true });
      }
    });
  });
};

export const rejectOrder = async (order) => {
  const q = query(
    collection(db, 'orders'),
    where('merchId', '==', order.merchId),
    where('custId', '==', order.custId),
    where('itemId', '==', order.itemId)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (doc) => {
    const docRef = doc.ref;

    await setDoc(docRef, { status: 'cancelled' }, { merge: true });

  });
};