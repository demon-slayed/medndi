import mongoose from 'mongoose';
import PostCareForm from '../models/postCareFormModel.js';
import Application from '../models/application.js';
import User from '../models/userModel.js';
import PostTreatment from '../models/postTreatmentModel.js';
import Treatment from '../models/treatmentModel.js';
import { sendMail } from '../utils/mailer.js';
import { postCareEmail } from '../utils/emailTemplates.js';


// Create a new post-care form
export const createPostCareForm = async (req, res) => {
  try {
    const {
      application_id,
      patient_name,
      date_of_birth,
      gender,
      email,
      phone_number,
      preferred_language,
      home_location,
      emergency_contact,
      post_treatment_id,
      preferred_followup_dates,
      preferred_timezone,
      preferred_time_range,
      needs_language_support,
      language_support_details,
      report_url,
      prescription_url,
      current_medications,
      known_allergies,
      still_abroad,
      expected_return_date,
      needs_accommodation_help,
      additional_notes
    } = req.body;

    // Validate required fields
    if (!application_id || !patient_name || !post_treatment_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if application exists
    const application = await Application.findById(application_id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Create new post-care form
    const newPostCareForm = new PostCareForm({
      application_id,
      patient_name,
      date_of_birth,
      gender,
      email,
      phone_number,
      preferred_language,
      home_location,
      emergency_contact,
      post_treatment_id,
      preferred_followup_dates,
      preferred_timezone,
      preferred_time_range,
      needs_language_support,
      language_support_details,
      report_url,
      prescription_url,
      current_medications,
      known_allergies,
      still_abroad,
      expected_return_date,
      needs_accommodation_help,
      additional_notes
    });

    await newPostCareForm.save();

    application.post_treatment = true;
    await application.save();

    const [me, service, treatment] = await Promise.all([
      User.findOne({ user_id: req.user?.user_id }),
      PostTreatment.findById(post_treatment_id).select('service_name'),
      Treatment.findById(application.treatment_id).select('treatment_name'),
    ]);
    sendMail({
      to: me?.email || email,
      ...postCareEmail(me ?? { fullName: patient_name }, {
        service: service?.service_name ?? 'Post-care support',
        treatment: treatment?.treatment_name,
        followupDates: preferred_followup_dates,
      }),
    });

    res.status(201).json({
      success: true,
      data: newPostCareForm,
      message: 'Post-care form created successfully'
    });
  } catch (error) {
    console.error('Error in createPostCareForm:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all post-care forms
export const getAllPostCareForms = async (req, res) => {
  try {
    const postCareForms = await PostCareForm.find()
      .populate('application_id')
      .populate('post_treatment_id')
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: postCareForms.length,
      data: postCareForms
    });
  } catch (error) {
    console.error('Error in getAllPostCareForms:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get post-care forms by user ID
export const getPostCareFormsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // First get all applications for this user
    const applications = await Application.find({ user_id: userId });
    
    if (!applications.length) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    // Get application IDs
    const applicationIds = applications.map(app => app._id);

    // Find post-care forms linked to these applications
    const postCareForms = await PostCareForm.find({
      application_id: { $in: applicationIds }
    })
      .populate('application_id')
      .populate('post_treatment_id')
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: postCareForms.length,
      data: postCareForms
    });
  } catch (error) {
    console.error('Error in getPostCareFormsByUserId:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get a single post-care form by ID
export const getPostCareFormById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const postCareForm = await PostCareForm.findById(id)
      .populate('application_id')
      .populate('post_treatment_id');

    if (!postCareForm) {
      return res.status(404).json({
        success: false,
        message: 'Post-care form not found'
      });
    }

    res.status(200).json({
      success: true,
      data: postCareForm
    });
  } catch (error) {
    console.error('Error in getPostCareFormById:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update a post-care form
export const updatePostCareForm = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const postCareForm = await PostCareForm.findById(id);
    
    if (!postCareForm) {
      return res.status(404).json({
        success: false,
        message: 'Post-care form not found'
      });
    }

    // Update the post-care form
    const updatedPostCareForm = await PostCareForm.findByIdAndUpdate(
      id,
      { 
        ...req.body,
        updated_at: Date.now()
      },
      { new: true, runValidators: true }
    );

    // If post_treatment_id is being updated, also update it in the application
    if (req.body.post_treatment_id) {
      await Application.findByIdAndUpdate(
        postCareForm.application_id,
        { PostTreatment_id: req.body.post_treatment_id }
      );
    }

    res.status(200).json({
      success: true,
      data: updatedPostCareForm,
      message: 'Post-care form updated successfully'
    });
  } catch (error) {
    console.error('Error in updatePostCareForm:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete a post-care form
export const deletePostCareForm = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const postCareForm = await PostCareForm.findById(id);
    
    if (!postCareForm) {
      return res.status(404).json({
        success: false,
        message: 'Post-care form not found'
      });
    }

    await PostCareForm.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Post-care form deleted successfully'
    });
  } catch (error) {
    console.error('Error in deletePostCareForm:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update post-care form status
export const updatePostCareFormStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    if (!status || !['pending', 'approved', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const postCareForm = await PostCareForm.findById(id);
    
    if (!postCareForm) {
      return res.status(404).json({
        success: false,
        message: 'Post-care form not found'
      });
    }

    postCareForm.status = status;
    postCareForm.updated_at = Date.now();
    await postCareForm.save();

    res.status(200).json({
      success: true,
      data: postCareForm,
      message: 'Post-care form status updated successfully'
    });
  } catch (error) {
    console.error('Error in updatePostCareFormStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};