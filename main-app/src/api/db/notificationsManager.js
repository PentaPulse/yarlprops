import { collection, query, addDoc, doc, deleteDoc, updateDoc, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default class NotificationsManager {
  constructor(user) {
    this.user = user; // Store user object
    this.notifications = []; // In-memory notification store
    this.unsubscribe = null; // For real-time listener
  }

  // Sync notifications with real-time updates and pass them to a callback
  syncNotifications(callback) {
    const q = query(collection(db, 'systemusers', this.user.uid, 'notifications'), orderBy('timestamp', 'desc'));

    // Clear existing listener before adding a new one (if needed)
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    try {
      this.unsubscribe = onSnapshot(q, (qSnapshot) => {
        const nData = qSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id
        }));
        this.notifications = nData;
        console.log("Synced notifications: ", this.notifications);

        // Pass the notifications array to the provided callback
        callback(this.notifications);
      });
    } catch (e) {
      console.log('Error syncing notifications: ', e);
      callback([]); // Send empty array on error
    }
  }

  // Unsubscribe from notifications when no longer needed
  unsubscribeNotifications() {
    if (this.unsubscribe) {
      this.unsubscribe(); // Unsubscribe from Firestore listener
    }
  }

  //item notifications  
  //add,update,remove
  async itemNotification(item, itemType, action) {
    const notification = {
      itemName: item.title,
      itemType: itemType,
      itemImage: item.images[0],
      merchantName: this.user.displayName,
      action: action,
      path: ``,
      isItem: true,
      timestamp: new Date().toISOString(),
      read: false,
      done: false
    };
    try {
      //sent to user
      const docRef = await addDoc(collection(db, 'systemusers', this.user.uid, 'notifications'), { ...notification, topic: `Request ${notification.done ? "accepted by" : "sent to"} ADMINS` })
      //sent to admins
      await addDoc(collection(db, 'admins', 'notifications', 'items'), { ...notification, userDocId: docRef.id, topic: `${itemType} ${action} request` })
      //save in memory
      this.notifications.push({ ...notification, id: docRef.id, topic: `Request sent to ADMINS` })
      return docRef.id
    } catch (e) {
      console.log("error adding notification: ", e)
    }
  }

  //user notifications
  async welcomeNotification(user) {
    const welcome = {
      topic: `Welcome to Yarlprops ${user.displayName}`,

      userNoticeLevel: 'welcome',
      isItem: false,
      createdAt: new Date().toISOString()
    }
    try {
      const docRef = await addDoc(collection(db, 'systemusers', user.uid, 'notifications'), welcome)
      this.notifications.push({ ...welcome, id: docRef.id })
    } catch (e) { }
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
