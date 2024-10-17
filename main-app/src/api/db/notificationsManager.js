import { collection, query, addDoc, doc, deleteDoc, updateDoc, orderBy, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../firebase";

// In-memory notification store and listener reference
let notifications = [];

// Sync notifications with real-time updates and pass them to a callback
export async function syncNotifications(user) {
  const q = query(collection(db, 'systemusers', user.uid, 'notifications'), orderBy('timestamp', 'desc'));
  
  try {
    const snapsot = await getDocs(q)
    const nData = snapsot.docs.map((doc)=>doc.data())
    return nData
  } catch (e) {
    console.log('Error syncing notifications: ', e);
  }
}

// Add a new item-related notification for the user and admins
export async function itemNotification(user, item, itemType, action) {
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
    const docRef = await addDoc(collection(db, 'systemusers', user.uid, 'notifications'), {
      ...notification,
      topic: `Request ${notification.done ? "accepted by" : "sent to"} ADMINS`,
    });
    // Sent to admins
    await addDoc(collection(db, 'admins', 'notifications', 'items'), {
      ...notification,
      userDocId: docRef.id,
      topic: `${itemType} ${action} request`,
    });
    // Save in memory
    notifications.push({ ...notification, id: docRef.id, topic: `Request sent to ADMINS` });
    return docRef.id;
  } catch (e) {
    console.log("Error adding notification: ", e);
  }
}

// Add a welcome notification for the user
export async function welcomeNotification(user) {
  const welcome = {
    topic: `Welcome to Yarlprops ${user.displayName}`,
    userNoticeLevel: 'welcome',
    isItem: false,
    createdAt: new Date().toISOString(),
  };
  try {
    const docRef = await addDoc(collection(db, 'systemusers', user.uid, 'notifications'), welcome);
    notifications.push({ ...welcome, id: docRef.id });
  } catch (e) {
    console.log("Error adding welcome notification: ", e);
  }
}

// Remove a notification from Firestore and local store
export async function removeNotification(user, notificationId) {
  try {
    // Remove from Firestore
    await deleteDoc(doc(db, 'systemusers', user.uid, 'notifications', notificationId));
    // Remove from local store
    notifications = notifications.filter((notification) => notification.id !== notificationId);
    console.log(`Notification with ID ${notificationId} removed.`);
  } catch (e) {
    console.log('Error removing notification: ', e);
  }
}

// Mark a notification as read in Firestore and local store
export async function markAsRead(user, notificationId) {
  const notification = notifications.find((notification) => notification.id === notificationId);
  if (notification && !notification.read) {
    try {
      // Update in Firestore
      await updateDoc(doc(db, 'systemusers', user.uid, 'notifications', notificationId), {
        read: true,
      });
      // Update local store
      notification.read = true;
      console.log(`Notification with ID ${notificationId} marked as read.`);
    } catch (e) {
      console.log('Error marking notification as read: ', e);
    }
  }
}

// Get all notifications (from local store)
export function getUserNotifications() {
  return notifications;
}
