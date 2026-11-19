import Notification from '../models/notification.js';
import { v4 as uuidv4 } from 'uuid';

// Get All User Notifications
export const getUserNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;
    const notifications = await Notification.find({ user_id }).sort({ created_at: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Notification by ID
export const getNotificationById = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const notification = await Notification.findOne({ notification_id });
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create Notification
export const createNotification = async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;
    if (!user_id || !title || !message || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newNotification = new Notification({
      notification_id: uuidv4(),
      user_id,
      title,
      message,
      type
    });

    await newNotification.save();
    res.status(201).json({ message: 'Notification created', notification: newNotification });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Mark Notification as Read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { notification_id },
      { read: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Mark All Notifications as Read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { user_id } = req.params;
    await Notification.updateMany({ user_id, read: false }, { read: true });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete Notification
export const deleteNotification = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const notification = await Notification.findOneAndDelete({ notification_id });

    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
