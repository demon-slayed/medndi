import express from 'express'
import { createHotelController, deleteHotelController, getAllHotelsController, getHotelByIdController, getHotelsByHospital, updateHotelController } from '../controllers/hotelController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';

const router = express.Router();

// create hotel
router.post('/create', requireSignIn, isAdmin, createHotelController);

// get all hotels
router.get('/', getAllHotelsController);

// get hotel by id
router.get('/:hotel_id', getHotelByIdController);

// get hotels by hospital id
router.get("/hospitalid/:hospital_id", getHotelsByHospital);

// update hotel
router.put('/:_id', requireSignIn, isAdmin, updateHotelController);

// delete hotel
router.delete('/:_id', requireSignIn, isAdmin, deleteHotelController);

export default router;

