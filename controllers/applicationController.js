import Application from '../models/application.js';
import { v4 as uuidv4 } from "uuid"; 

export const createApplication = async (req, res) => {
  try {
    const {
      user_id,
      treatment_id,
      hospital_id,
      hotel_id,
      travel_plan,
      insurance_id,
      treatmentdateandtime,
      total_cost,
    } = req.body;
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
    const { user_id } = req.params

    const applications = await Application.find({ user_id })
      .populate('user_id')
      .populate('treatment_id')
      .populate('hospital_id')
      .populate('hotel_id')
      .populate('insurance_id');

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: 'No applications found for this user.', user: user_id });
    }

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ error: error.message });
  }
};


// Get all applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('user_id')
      .populate('treatment_id')
      .populate('hospital_id')
      .populate('hotel_id')
      // .populate('travel_plan_id')
      .populate('insurance_id');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an application by ID
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('user_id')
      .populate('treatment_id')
      .populate('hospital_id')
      .populate('hotel_id')
      .populate('travel_plan_id')
      .populate('insurance_id');

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
      req.body,
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
