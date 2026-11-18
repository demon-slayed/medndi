import express from 'express';
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationByUserId
} from '../controllers/applicationController.js'
import { isAdmin } from '../middlewares/isAdminMiddleware.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', requireSignIn, createApplication);
router.get('/getall', requireSignIn, getAllApplications);
router.get('/getById/:id', requireSignIn, getApplicationById);
router.get('/getByUserId/:user_id', requireSignIn, getApplicationByUserId);
router.put('/update/:_id', requireSignIn, isAdmin, updateApplication);
router.delete('/delete/:id', requireSignIn, isAdmin, deleteApplication);


export default router;
