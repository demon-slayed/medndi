import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin
} from '../controllers/adminController.js';

import { requireSignIn } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected routes (Admin only)
router.get('/', requireSignIn, isAdmin, getAllAdmins);
router.get('/:id', requireSignIn, isAdmin, getAdminById);
router.put('/:id', requireSignIn, isAdmin, updateAdmin);
router.delete('/:id', requireSignIn, isAdmin, deleteAdmin);

export default router;
