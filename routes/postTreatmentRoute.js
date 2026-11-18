import express from 'express';
import {
  createPostTreatment,
  getAllPostTreatments,
  getPostTreatmentById,
  updatePostTreatment,
  deletePostTreatment,
  uploadFileController
} from '../controllers/postTreatmentController.js';

import { requireSignIn } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const random = uuidv4();
      cb(null, random+""+file.originalname);
    }
  })

const upload = multer({ storage: storage })

const router = express.Router();

// Protected routes (Admin only)
router.post('/create', requireSignIn, isAdmin, createPostTreatment);
router.get('/getall', requireSignIn, getAllPostTreatments);
router.get('/getbyid/:id', requireSignIn, getPostTreatmentById);
router.put('/update/:id', requireSignIn, isAdmin, updatePostTreatment);
router.delete('/delete/:id', requireSignIn, isAdmin, deletePostTreatment);
router.post('/file-upload', upload.single('myfile'), uploadFileController)

export default router;
