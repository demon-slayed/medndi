import Insurance from '../models/insuranceModel.js';
import { v4 as uuidv4 } from "uuid";

// Create a new insurance plan
export const createInsurance = async (req, res) => {
  try {
    const {
      name,
      description,
      features,
      price,
      emi_options,
      eligibility_criteria,
      government_schemes,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: "Missing required fields: name and price are required." });
    }

    const newInsurance = new Insurance({
      insurance_id: uuidv4(),
      name,
      description,
      features,
      price,
      emi_options,
      eligibility_criteria,
      government_schemes,
    });

    const savedInsurance = await newInsurance.save();
    res.status(201).json(savedInsurance);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Get all insurance plans
export const getAllInsurance = async (req, res) => {
  try {
    const insurances = await Insurance.find();
    res.status(200).json(insurances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an insurance plan by ID
export const getInsuranceById = async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.id);
    if (!insurance) {
      return res.status(404).json({ message: 'Insurance plan not found' });
    }
    res.status(200).json(insurance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an insurance plan
export const updateInsurance = async (req, res) => {
  try {
    const updatedInsurance = await Insurance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedInsurance) {
      return res.status(404).json({ message: 'Insurance plan not found' });
    }
    res.status(200).json(updatedInsurance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an insurance plan
export const deleteInsurance = async (req, res) => {
  try {
    const deletedInsurance = await Insurance.findByIdAndDelete(req.params.id);
    if (!deletedInsurance) {
      return res.status(404).json({ message: 'Insurance plan not found' });
    }
    res.status(200).json({ message: 'Insurance plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
