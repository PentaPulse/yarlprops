import { collection, getDocs, query, addDoc, doc, deleteDoc, updateDoc, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export default class NotificationsManager {
  constructor(user) {
    this.user = user; // Store user object
    this.notifications = []; // In-memory notification store
  }

  // Sync notifications from Firestore
  async syncNotifications() {
    const q = query(collection(db, 'systemusers', this.user.uid, 'notifications'),orderBy('timestamp','desc'));
    try {
      const qSnapshot = await getDocs(q);
      const nData = qSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      this.notifications = nData;
      return this.notifications;
    } catch (e) {
      console.log('Error retrieving notifications: ', e);
      return [];
    }
  }

  //item notifications  
  //add,update,remove
  async itemNotification(item, itemType,  action) {
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
      done:false
    };
    try {
      //sent to user
      const docRef = await addDoc(collection(db, 'systemusers', this.user.uid, 'notifications'), { ...notification,  topic: `Request ${notification.done?"accepted by":"sent to"} ADMINS` })
      //sent to admins
      await addDoc(collection(db, 'admins', 'notifications', 'items'), { ...notification,  topic: `${itemType} ${action} request` })
      //save in memory
      this.notifications.push({ ...notification, id: docRef.id, topic: `Request sent to ADMINS` })
      return docRef.id
    } catch (e) {
      console.log("error adding notification: ", e)
    }
  }

  //user notifications
  async welcomeNotification(user){
    const welcome = {
      topic:`Welcome to Yarlprops ${user.displayName}`      
    }
    try{
      const docRef=await addDoc(collection(db,'systemusers',user.uid,'notifications'),welcome)
      this.notifications.push({...welcome,id:docRef.id})
    }catch(e){}
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
