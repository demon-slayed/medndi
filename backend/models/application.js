import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  application_id: { type: String, required: true, unique: true },
  user_id: { type: mongoose.Schema.Types.String, ref: 'User', required: true },
  treatment_id: { type: mongoose.Schema.Types.String, ref: 'Treatment', required: true },
  hospital_id: { type: mongoose.Schema.Types.String, ref: 'Hospital', required: true },
  hotel_id: { type: mongoose.Schema.Types.String, ref: 'Hotel' },
  // travel_plan_id: { type: mongoose.Schema.Types.String, ref: 'TravelPlan' },
  travel_plan: {
      type: Object,
      default: {}
  },
  insurance_id: { type: mongoose.Schema.Types.String, ref: 'Insurance' },
  treatmentdateandtime: {type: String},
  post_treatment: { type: Boolean, default: false },
  status: { type: String, enum: ['initilal_assessment', 'document_verification', 'board_meeting', 'travel_accomodation', 'insurance', 'approved', 'rejected'], default: 'initilal_assessment' },
  total_cost: { type: Number },
  payment_status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  payment_gateway: { type: String, enum: ['Razorpay', 'Stripe'] },
  payment_details: {
    payment_id: { type: String },
    payment_date: { type: Date }
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', ApplicationSchema);
export default Application;
