import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  admin_id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Super-Admin', 'Admin'], required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
