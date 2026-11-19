import Hospital from "../models/hospitalModel.js";
import Treatment from "../models/treatmentModel.js";

//  Get all hospitals
export const getHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find().populate("Hotels");
        res.status(200).json(hospitals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get hospital by ID
export const getHospitalById = async (req, res) => {
    try {
        const hospital = await Hospital.findOne({ hospital_id: req.params.hospital_id }).populate("Hotels");

        if (!hospital) return res.status(404).json({ message: "Hospital not found" });

        res.status(200).json(hospital);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new hospital (Admin only)
export const createHospital = async (req, res) => {
    try {
        const newHospital = new Hospital(req.body);
        await newHospital.save();
        res.status(201).json({ message: "Hospital created successfully", hospital: newHospital });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update hospital by ID (Admin only)
export const updateHospital = async (req, res) => {
    try {
        const updatedHospital = await Hospital.findOneAndUpdate(
            { _id: req.params._id },
            { $set: req.body, updated_at: Date.now() },
            { new: true }
        );

        if (!updatedHospital) return res.status(404).json({ message: "Hospital not found" });

        res.status(200).json({ message: "Hospital updated", hospital: updatedHospital });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete hospital by ID (Admin only)
export const deleteHospital = async (req, res) => {
    try {
        const deletedHospital = await Hospital.findOneAndDelete({ _id: req.params._id });

        if (!deletedHospital) return res.status(404).json({ message: "Hospital not found" });
        await Treatment.updateMany({}, { $pull: { available_hospitals: deletedHospital._id } });

        res.status(200).json({ message: "Hospital deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
