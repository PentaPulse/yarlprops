import { collection, getDocs, query, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default class NotificationsManager {
  constructor(user) {
    this.user = user; // Store user object
    this.notifications = []; // In-memory notification store
  }

  // Sync notifications from Firestore
  async syncNotifications() {
    const q = query(collection(db, 'systemusers', this.user.uid, 'notifications'));
    try {
      const qSnapshot = await getDocs(q);
      const nData = qSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id // Preserve document ID
      }));
      this.notifications = nData; // Sync notifications with local array
      return this.notifications;
    } catch (e) {
      console.log('Error retrieving notifications: ', e);
      return [];
    }
  }

  // Add a notification to Firestore and local store
  async addNotification(message, path) {
    const newNotification = {
      message,
      path,
      timestamp: new Date().toISOString(),
      read: false,
    };
    try {
      // Add the notification to Firestore
      const docRef = await addDoc(collection(db, 'systemusers', this.user.uid, 'notifications'), newNotification);
      // Add notification to local store with the Firestore doc ID
      this.notifications.push({ ...newNotification, id: docRef.id });
      return docRef.id;
    } catch (e) {
      console.log('Error adding notification: ', e);
    }
  }

  async addItemNotification(item, itemType, merchant, action) {
    const newNotification = {
      itemName: item.title,
      itemType: itemType,
      itemImage:item.images[0],
      merchantName: merchant.displayName,
      action: action,
      path: ``,
      isItem: true,
      timestamp: new Date().toISOString(),
      read: false
    };
    try {
      //sent to admins
      const adocRef = await addDoc(collection(db, 'admins', 'notifications', 'items'), { ...newNotification, id: adocRef.id,topic: `${itemType} ${action} request` })
      //sent to user
      const sdocRef = await addDoc(collection(db, 'systemusers', this.user.uid, 'notifications'), { ...newNotification,id: sdocRef.id, topic: `Request sent to ADMINS` })
      //save in memory
      this.notifications.push({ ...newNotification, id: sdocRef.id, topic: `Request sent to ADMINS` })
      return sdocRef.id
    } catch (e) {
      console.log("error adding notification: ", e)
    }
  }

  // Remove a notification from Firestore and local store
  async removeNotification(notificationId) {
    try {
      // Remove from Firestore
      await deleteDoc(doc(db, 'systemusers', this.user.uid, 'notifications', notificationId));
      // Remove from local store
      this.notifications = this.notifications.filter((notification) => notification.id !== notificationId);
      console.log(`Notification with ID ${notificationId} removed.`);
    } catch (e) {
      console.log('Error removing notification: ', e);
    }
  }

  // Mark a notification as read in Firestore and local store
  async markAsRead(notificationId) {
    const notification = this.notifications.find((notification) => notification.id === notificationId);
    if (notification && !notification.read) {
      try {
        // Update in Firestore
        await updateDoc(doc(db, 'systemusers', this.user.uid, 'notifications', notificationId), {
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
  getUserNotifications() {
    return this.notifications;
  }
}
