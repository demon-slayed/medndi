import express from 'express';
import { 
  getAllFlights, 
  getFlightByNumber, 
  getFlightsByRoute, 
  createFlight, 
  updateFlight, 
  deleteFlight 
} from '../controllers/flightController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';

const router = express.Router();

router.get('/', getAllFlights);
router.get('/route', getFlightsByRoute);
router.get('/:flight_number', getFlightByNumber);
router.post('/', requireSignIn, isAdmin, createFlight);
router.put('/:flight_number', requireSignIn, isAdmin, updateFlight);
router.delete('/:flight_number', requireSignIn, isAdmin, deleteFlight);

export default router;
