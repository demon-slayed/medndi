import express from "express";
import {
    getTreatments,
    getTreatmentById,
    createTreatment,
    updateTreatment,
    deleteTreatment,
    getTreatmentsByHospital
} from "../controllers/treatmentController.js";

import { requireSignIn } from '../middlewares/authMiddleware.js'
import { isAdmin }  from '../middlewares/isAdminMiddleware.js'

const router = express.Router();

router.get("/", getTreatments);
router.get("/:treatment_id", getTreatmentById);
router.get("/hospital/:hospital_id", getTreatmentsByHospital);
router.post("/create", requireSignIn, isAdmin, createTreatment);
router.put("/:_id", requireSignIn, isAdmin, updateTreatment);
router.delete("/:_id", requireSignIn, isAdmin, deleteTreatment);

export default router;
