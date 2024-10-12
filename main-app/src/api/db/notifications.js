import { collection, getDocs, query } from "firebase/firestore"
import { db } from "../firebase"

export const showNotifications = async (user) => {
    const q = query(collection(db, 'systemusers', user.uid, 'notifications'))
    try {
        const qSnapshot = await getDocs(q)
        const nData = qSnapshot.docs.map((doc) => doc.data())
        return nData
    } catch (e) {
        console.log('error retriving notifications : ',e)
    }
}

export const addNotification=async(user)=>{
    const q = query(collection(db,'systemusers',user.uid,'notifications'))
}
class Notifications {
    constructor(user) {
      this.user = user;
      this.notifications = [];
    }
  
    addNotification(message, path) {
      const newNotification = {
        id: Date.now(),
        message,
        path,
        timestamp: new Date().toISOString(),
        read: false,
      };
      this.notifications.push(newNotification);
      return newNotification;
    }
  
    removeNotification(notificationId) {
      this.notifications = this.notifications.filter(
        (notification) => notification.id !== notificationId
      );
    }
  
    markAsRead(notificationId) {
      const notification = this.notifications.find(
        (notification) => notification.id === notificationId
      );
      if (notification) {
        notification.read = true;
      }
    }
  
    getUserNotifications() {
      return this.notifications;
    }
  }
  