import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";


export const getNotifications = async (user) => {
  try {
    const snapshot = await getDocs(collection(db, 'notifications'), orderBy('timestamp', 'desc'))
    const data = snapshot.docs.map((doc) => doc.data())
    return data
  } catch (e) {
    return []
  }
}

export const getNewNotifications = async (user) => {
  try {
    const snapshot = await getDocs(collection(db, 'notifications'), where('read', '==', false))
    const data = snapshot.docs.map((doc) => doc.data())
    return data
  } catch (e) {
    return []
  }
}

export const itemNotification = async (user, item, itemType, action) => {
  const notification = {
    itemName: item.title,
    itemType: itemType,
    itemImage: item.images[0],
    merchantName: user.displayName,
    action: action,
    path: ``,
    isItem: true,
    timestamp: new Date().toISOString(),
    read: false,
    done: false,
  };
  try {
    // Sent to user
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notification,
      topic: `Request ${notification.done ? "accepted by" : "sent to"} ADMINS`,
    });
    // Sent to admins
    await addDoc(collection(db, 'admins', 'notifications', 'items'), {
      ...notification,
      userDocId: docRef.id,
      topic: `${itemType} ${action} request`,
    });
  } catch (e) {
    console.log("Error adding notification: ", e);
  }
}

export const welcomeNotification = async (user) => {
  const welcome = {
    topic: `Welcome to Yarlprops ${user.displayName}`,
    userNoticeLevel: 'welcome',
    isItem: false,
    timestamp: new Date().toISOString(),
  };
  try {
    await addDoc(collection(db,'admins',user.uid, 'notifications'), welcome);
  } catch (e) {
    console.log("Error adding welcome notification: ", e);
  }
}

export const removeNotification = async (user, notificationId) => {
  try {
    await deleteDoc(doc(db, 'notifications', notificationId));
    console.log(`Notification with ID ${notificationId} removed.`);
  } catch (e) {
    console.log('Error removing notification: ', e);
  }
}

export const markAsRead = async (user, notificationId) => {
  try {
    // Update in Firestore
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true,
    });
    console.log(`Notification with ID ${notificationId} marked as read.`);
  } catch (e) {
    console.log('Error marking notification as read: ', e);
  }

}