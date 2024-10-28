// NotificationManager.js
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';

class NotificationManager {
  constructor() {
    this.db = getFirestore();
  }

  /**
   * Add a new notification
   * @param {Object} notification - The notification details
   * @param {string} notification.variant - Type of notification (e.g., welcome, changerole)
   * @param {string} notification.path - Path related to the notification
   * @param {string} notification.userId - User ID associated with the notification
   * @param {boolean} notification.requiresAdminPermission - Whether the notification requires admin permission
   * @param {Date} [notification.timestamp=new Date()] - Timestamp of the notification
   * @param {Object} [notification.additionalFields={}] - Additional fields if any
   * @returns {Promise} Promise representing the notification ID of the added notification
   */
  async addNotification({ variant, path, userId, requiresAdminPermission, timestamp = new Date(), additionalFields = {} }) {
    try {
      const notificationData = {
        variant,
        path,
        userId,
        timestamp: this.formatTimestamp(timestamp),
        ...additionalFields
      };
      
      let collectionRef;

      // Determine the collection based on admin permission requirement
      if (requiresAdminPermission) {
        collectionRef = collection(this.db, 'admins', 'notifications', variant);
      } else {
        collectionRef = collection(this.db, 'systemuser', userId, 'notifications');
      }

      const docRef = await addDoc(collectionRef, notificationData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding notification: ', error);
      throw error;
    }
  }

  /**
   * Update an existing notification
   * @param {string} id - The document ID of the notification to update
   * @param {string} userId - The user ID associated with the notification (null if for admin)
   * @param {string} variant - Type of notification (only if admin permission required)
   * @param {Object} updatedData - The updated data fields
   * @param {boolean} requiresAdminPermission - Whether the notification requires admin permission
   * @returns {Promise} Promise representing the completion of the update
   */
  async updateNotification(id, updatedData, { userId, variant, requiresAdminPermission }) {
    try {
      let docRef;

      if (requiresAdminPermission) {
        docRef = doc(this.db, 'admins', 'notifications', variant, id);
      } else {
        docRef = doc(this.db, 'systemuser', userId, 'notifications', id);
      }

      await updateDoc(docRef, updatedData);
    } catch (error) {
      console.error('Error updating notification: ', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   * @param {string} id - The document ID of the notification to delete
   * @param {string} userId - The user ID associated with the notification (null if for admin)
   * @param {string} variant - Type of notification (only if admin permission required)
   * @param {boolean} requiresAdminPermission - Whether the notification requires admin permission
   * @returns {Promise} Promise representing the completion of the deletion
   */
  async deleteNotification(id, { userId, variant, requiresAdminPermission }) {
    try {
      let docRef;

      if (requiresAdminPermission) {
        docRef = doc(this.db, 'admins', 'notifications', variant, id);
      } else {
        docRef = doc(this.db, 'systemuser', userId, 'notifications', id);
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting notification: ', error);
      throw error;
    }
  }

  /**
   * Retrieve notifications for a specific user or admin category
   * @param {string} userId - The user ID to filter notifications by (null if for admin)
   * @param {string} [variant] - Type of notification (only if admin permission required)
   * @param {boolean} requiresAdminPermission - Whether the notifications require admin permission
   * @returns {Promise} Promise representing an array of notifications
   */
  async getNotifications({ userId, variant, requiresAdminPermission }) {
    try {
      let collectionRef;

      if (requiresAdminPermission) {
        collectionRef = collection(this.db, 'admins', 'notifications', variant);
      } else {
        collectionRef = collection(this.db, 'systemuser', userId, 'notifications');
      }

      const querySnapshot = await getDocs(collectionRef);
      const notifications = [];
      querySnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() });
      });
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications: ', error);
      throw error;
    }
  }

  /**
   * Format a timestamp to 'yyyy/mm/dd hh:mm:ss'
   * @param {Date} date - Date object to format
   * @returns {string} Formatted timestamp
   */
  formatTimestamp(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd} ${hh}:${min}:${ss}`;
  }
}

export default NotificationManager;
