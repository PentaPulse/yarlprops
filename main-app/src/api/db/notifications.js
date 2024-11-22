import { collection, getDocs,  doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';


// Function to fetch notifications for the user
export const fetchNotifications = async (userId) => {
    try {

        // Fetch all documents in the notifications subcollection
        const querySnapshot = await getDocs(collection(db, 'systemusers', userId, 'notifications'));

        // Map the results to an array
        const notifications = querySnapshot.docs.map((doc) => doc.data());
        console.log(notifications)

        return notifications;
    } catch (error) {
        console.error('Error fetching notifications func:', error);
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
