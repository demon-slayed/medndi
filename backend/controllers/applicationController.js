import mongoose from 'mongoose';
import Application from '../models/application.js';
import User from '../models/userModel.js';
import Treatment from '../models/treatmentModel.js';
import { recordActivity } from '../utils/activity.js';
import { v4 as uuidv4 } from "uuid"; 

const withRelations = (query) =>
  query
    .populate('user_id', '-password')
    .populate('treatment_id')
    .populate('hospital_id')
    .populate('hotel_id')
    .populate('insurance_id');

export const createApplication = async (req, res) => {
  try {
    // Applications store the User's _id; take it from the session, never from the body.
    const me = await User.findOne({ user_id: req.user.user_id });
    if (!me) {
      return res.status(401).json({ message: "User not found, please log in again." });
    }
    const user_id = me._id.toString();
    const {
      treatment_id,
      hospital_id,
      hotel_id,
      travel_plan,
      insurance_id,
      treatmentdateandtime,
      total_cost,
    } = req.body;
    // One malformed reference would break populate for every listing of this user's bookings
    const isId = (value) => mongoose.Types.ObjectId.isValid(value);
    if (!isId(treatment_id) || !isId(hospital_id)) {
      return res.status(400).json({ message: "Please choose a valid treatment and hospital." });
    }
    for (const [field, value] of Object.entries({ hotel_id, insurance_id })) {
      if (value != null && value !== "" && !isId(value)) {
        return res.status(400).json({ message: `Invalid ${field}.` });
      }
    }

    const application_id = `APP-${uuidv4().split("-")[0].toUpperCase()}`;
    const newApplication = new Application({
      application_id,
      user_id,
      treatment_id,
      hospital_id,
      hotel_id,
      travel_plan,
      insurance_id,
      treatmentdateandtime,
      total_cost,
    });

    // Save to database
    const savedApplication = await newApplication.save();
    const bookedTreatment = await Treatment.findById(treatment_id).select('treatment_name');
    await recordActivity(req, me, 'booking', `Booked ${bookedTreatment?.treatment_name ?? 'a treatment'} (${application_id})`);

    res.status(201).json({
      message: "Application created successfully",
      data: savedApplication,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({
      message: "Failed to create application",
      error: error.message,
    });
  }
};

// get application by user id
export const getApplicationByUserId = async (req, res) => {
  try {
    // Patients only ever see their own applications; admins may look up anyone.
    const me = await User.findOne({ user_id: req.user.user_id });
    if (!me) {
      return res.status(401).json({ message: "User not found, please log in again." });
    }
    const user_id = me.role === 'Admin' ? req.params.user_id : me._id.toString();

    const applications = await withRelations(Application.find({ user_id }).sort({ created_at: -1 }));
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ error: error.message });
  }
};


// Get all applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await withRelations(Application.find().sort({ created_at: -1 }));
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an application by ID
export const getApplicationById = async (req, res) => {
  try {
    const application = await withRelations(Application.findById(req.params.id));

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an application
export const updateApplication = async (req, res) => {
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params._id,
      { ...req.body, updated_at: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an application
export const deleteApplication = async (req, res) => {
  try {
    const deletedApplication = await Application.findByIdAndDelete(req.params.id);
    if (!deletedApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
