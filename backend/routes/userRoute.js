import express from 'express'
import { loginController, logoutController, registerController, userDeleteController, userDetailsController, userUpdateController } from '../controllers/userController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';
import { listActivity, listUsers } from '../controllers/adminUsersController.js';

const router = express.Router();

//  registration of user
router.post('/register', registerController);

// login of user
router.post('/login', loginController);

// get-user-details
router.get('/profile', requireSignIn ,userDetailsController);

//update-user-info
router.put('/update', requireSignIn, userUpdateController)

//delete-user
router.delete('/delete', requireSignIn, userDeleteController);

//logout-user
router.post('/logout', logoutController);

// admin: users and their sign-up / login / booking activity
router.get('/admin/list', requireSignIn, isAdmin, listUsers);
router.get('/admin/activity', requireSignIn, isAdmin, listActivity);


export default router;