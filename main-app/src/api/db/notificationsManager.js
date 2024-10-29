// NotificationManager.js
import {  collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

class NotificationManager {
  constructor() {
    this.db = db;
  }

  async addNotification({ variant, path, userId, requiresAdminPermission, timestamp = new Date(), additionalFields = {} }) {
    try {
      const notificationData = {
        variant,
        path,
        userId,
        timestamp: this.formatDate(timestamp),
        ...additionalFields
      };

      let collectionRef;

      if (requiresAdminPermission) {
        collectionRef = collection(this.db, 'admins', 'notifications', variant);
      } else {
        collectionRef = collection(this.db, 'systemusers', userId, 'notifications');
      }

      const docRef = await addDoc(collectionRef, notificationData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding notification: ', error);
      throw error;
    }
  }
  async updateNotification(id, updatedData, { userId, variant, requiresAdminPermission }) {
    try {
      let docRef;

      if (requiresAdminPermission) {
        docRef = doc(this.db, 'admins', 'notifications', variant, id);
      } else {
        docRef = doc(this.db, 'systemusers', userId, 'notifications', id);
      }

      await updateDoc(docRef, updatedData);
    } catch (error) {
      console.error('Error updating notification: ', error);
      throw error;
    }
  }
  async deleteNotification(id, { userId, variant, requiresAdminPermission }) {
    try {
      let docRef;

      if (requiresAdminPermission) {
        docRef = doc(this.db, 'admins', 'notifications', variant, id);
      } else {
        docRef = doc(this.db, 'systemusers', userId, 'notifications', id);
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting notification: ', error);
      throw error;
    }
  }
  async getNotifications({ userId }) {
    try {
      let collectionRef;

      collectionRef = collection(this.db, 'systemusers', userId, 'notifications');

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

  formatDate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}.${minutes}.${seconds}`;
  }
}

export default NotificationManager;
