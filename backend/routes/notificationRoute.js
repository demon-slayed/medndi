import express from 'express';
import { 
  getUserNotifications, 
  getNotificationById, 
  createNotification, 
  markNotificationAsRead, 
  deleteNotification, 
  markAllNotificationsAsRead 
} from '../controllers/notificationController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/user/:user_id', requireSignIn, getUserNotifications);
router.get('/:notification_id', requireSignIn, getNotificationById);
router.post('/', requireSignIn, createNotification);
router.put('/:notification_id/read', requireSignIn, markNotificationAsRead);
router.put('/user/:user_id/read-all', requireSignIn, markAllNotificationsAsRead);
router.delete('/:notification_id', requireSignIn, deleteNotification);

export default router;
