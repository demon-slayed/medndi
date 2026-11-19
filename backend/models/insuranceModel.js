import mongoose from 'mongoose';

const InsuranceSchema = new mongoose.Schema({
  insurance_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  features: [{ type: String }],
  price: { type: Number },
  emi_options: [{ type: String }],  // e.g., 3 months, 6 months
  eligibility_criteria: { type: String },
  government_schemes: [{ type: String }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Insurance = mongoose.model('Insurance', InsuranceSchema);
export default Insurance;
