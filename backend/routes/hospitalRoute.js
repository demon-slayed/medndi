import express from "express";
import {
    getHospitals,
    getHospitalById,
    createHospital,
    updateHospital,
    deleteHospital
} from "../controllers/hospitalController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdminMiddleware.js";

const router = express.Router();

router.get("/", getHospitals);
router.get("/:hospital_id", getHospitalById);
router.post("/create", requireSignIn, isAdmin, createHospital);
router.put("/:_id", requireSignIn, isAdmin, updateHospital);
router.delete("/:_id", requireSignIn, isAdmin, deleteHospital);

export default router;
