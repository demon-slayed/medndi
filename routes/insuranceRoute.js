import express from 'express';
import {
  createInsurance,
  getAllInsurance,
  getInsuranceById,
  updateInsurance,
  deleteInsurance
} from '../controllers/insuranceController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';

const router = express.Router();

router.post('/create', requireSignIn, isAdmin, createInsurance);
router.get('/getall',  getAllInsurance);
router.get('/getbyid/:id', requireSignIn, getInsuranceById);
router.put('/update/:id', requireSignIn, isAdmin, updateInsurance);
router.delete('/delete/:id', requireSignIn, isAdmin, deleteInsurance);

export default router;

