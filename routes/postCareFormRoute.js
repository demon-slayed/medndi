import express from 'express';
import { createPostCareForm, deletePostCareForm, getAllPostCareForms, getPostCareFormById, getPostCareFormsByUserId, updatePostCareForm, updatePostCareFormStatus } from '../controllers/postCareFormController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';
const router = express.Router();

// Create a new post-care form
router.post('/create', requireSignIn, isAdmin, createPostCareForm);

// Get all post-care forms - admin only
router.get('/getall', requireSignIn, isAdmin, getAllPostCareForms);

// Get post-care forms by user ID
router.get('/getByUserId/:userId', requireSignIn, getPostCareFormsByUserId);

// Get a single post-care form by ID
router.get('/get/:id', requireSignIn, getPostCareFormById);

// Update a post-care form
router.put('/update/:id', requireSignIn, updatePostCareForm);

// Delete a post-care form - admin only
router.delete('/delete/:id', requireSignIn, isAdmin, deletePostCareForm);

// Update post-care form status
router.patch('/status/:id',  requireSignIn, updatePostCareFormStatus);

export default router;