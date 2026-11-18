import mongoose from "mongoose";

const postCareFormSchema = new mongoose.Schema({
  application_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  patient_name: {
    type: String,
    required: true
  },
  date_of_birth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  email: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  },
  preferred_language: {
    type: String,
    required: true
  },
  home_location: {
    type: String,
    required: true
  },
  emergency_contact: {
    type: String,
    required: true
  },
  post_treatment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostTreatment',
    required: true
  },
  preferred_followup_dates: {
    type: String,
    required: true
  },
  preferred_timezone: {
    type: String,
    required: true
  },
  preferred_time_range: {
    type: String,
    required: true
  },
  needs_language_support: {
    type: Boolean,
    default: false
  },
  language_support_details: {
    type: String
  },
  report_url: {
    type: String
  },
  prescription_url: {
    type: String
  },
  current_medications: {
    type: String
  },
  known_allergies: {
    type: String
  },
  still_abroad: {
    type: Boolean,
    default: false
  },
  expected_return_date: {
    type: Date
  },
  needs_accommodation_help: {
    type: Boolean,
    default: false
  },
  additional_notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update the updated_at field before saving
postCareFormSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const PostCareForm = mongoose.model('PostCareForm', postCareFormSchema);

export default PostCareForm;