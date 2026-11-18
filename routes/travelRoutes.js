import express from 'express';
import { 
  getAllTravelPlans, 
  getTravelPlanById, 
  createTravelPlan, 
  updateTravelPlan, 
  deleteTravelPlan 
} from '../controllers/travelController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';

const router = express.Router();

router.get('/travel-plans', getAllTravelPlans);
router.get('/travel-plans/:travel_plan_id', getTravelPlanById);
router.post('/travel-plans', requireSignIn, isAdmin, createTravelPlan);
router.put('/travel-plans/:travel_plan_id', requireSignIn, isAdmin, updateTravelPlan);
router.delete('/travel-plans/:travel_plan_id', requireSignIn, isAdmin, deleteTravelPlan);

export default router;
