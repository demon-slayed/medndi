import express from 'express';
import { 
  getAllPayments, 
  getPaymentsByApplication, 
  getPaymentById, 
  createPayment, 
  updatePaymentStatus, 
  generateReceipt 
} from '../controllers/paymentController.js';
import {  requireSignIn } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';

const router = express.Router();


router.post('/', requireSignIn, createPayment);
router.put('/:payment_id/status', requireSignIn, updatePaymentStatus);
router.get('/', requireSignIn, isAdmin, getAllPayments);
router.get('/application/:application_id', requireSignIn, getPaymentsByApplication);
router.get('/:payment_id', requireSignIn, getPaymentById);
router.get('/:payment_id/receipt', requireSignIn, generateReceipt);

export default router;
