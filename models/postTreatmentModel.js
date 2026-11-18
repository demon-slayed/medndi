import mongoose from 'mongoose';

const PostTreatmentSchema = new mongoose.Schema({
  service_name: { type: String, required: true },
  description: { type: String },
  service_type: {type: String},
  cost: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const PostTreatment = mongoose.model('PostTreatment', PostTreatmentSchema);
export default PostTreatment;
