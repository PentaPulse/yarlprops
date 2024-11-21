import {  collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Function to fetch notifications for the user
export const fetchNotifications = async (userId) => {
    try {
        const notificationsRef = collection(db,'systemusers',userId, 'notifications');
        const querySnapshot = await getDocs(notificationsRef);

        const notifications = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return notifications;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};

// Function to mark notification as read
export const markNotificationAsRead = async (notificationId) => {
    try {
        const notificationRef = doc(db, 'notifications', notificationId);
        await updateDoc(notificationRef, {
            read: true,
        });
        console.log('Notification marked as read');
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
};

// Function to delete a notification
export const deleteNotification = async (notificationId) => {
    try {
        const notificationRef = doc(db, 'notifications', notificationId);
        await deleteDoc(notificationRef);
        console.log('Notification deleted');
    } catch (error) {
        console.error('Error deleting notification:', error);
    }
};
