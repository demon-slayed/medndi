import mongoose from "mongoose";
import Treatment from "../models/treatmentModel.js";

//  Get all treatments
export const getTreatments = async (req, res) => {
    try {
        const treatments = await Treatment.find();
        res.status(200).json(treatments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Get treatment by ID
export const getTreatmentById = async (req, res) => {
    try {
        const treatment = await Treatment.findOne({ treatment_id: req.params.treatment_id }).populate("available_hospitals");
        if (!treatment) return res.status(404).json({ message: "Treatment not found" });

        res.status(200).json(treatment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get treatment by
export const getTreatmentsByHospital = async (req, res) => {
    try {
      const hospitalId = req.params.hospital_id;
  
      // Optional: validate if hospitalId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(hospitalId)) {
        return res.status(400).json({ error: "Invalid hospital ID" });
      }
  
      const treatments = await Treatment.find({
        available_hospitals: hospitalId,
      }).populate("available_hospitals");
  
      res.status(200).json(treatments);
    } catch (error) {
      console.error("Error fetching treatments:", error);
      res.status(500).json({ error: "Server error" });
    }
  };

// Create new treatment (Admin only)
export const createTreatment = async (req, res) => {
    try {
        const newTreatment = new Treatment(req.body);
        await newTreatment.save();
        res.status(201).json({ message: "Treatment created successfully", treatment: newTreatment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update treatment by ID (Admin only)
export const updateTreatment = async (req, res) => {
    try {
        const updatedTreatment = await Treatment.findOneAndUpdate(
            { _id: req.params._id },
            { $set: req.body, updated_at: Date.now() },
            { new: true }
        );

        if (!updatedTreatment) return res.status(404).json({ message: "Treatment not found" });

        res.status(200).json({ message: "Treatment updated", treatment: updatedTreatment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete treatment by ID (Admin only)
export const deleteTreatment = async (req, res) => {
    try {
        const deletedTreatment = await Treatment.findOneAndDelete({ _id: req.params._id });

        if (!deletedTreatment) return res.status(404).json({ message: "Treatment not found" });

        res.status(200).json({ message: "Treatment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
