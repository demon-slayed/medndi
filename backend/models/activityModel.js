import mongoose from "mongoose";

// Audit trail of user actions shown on the admin dashboard
const activitySchema = new mongoose.Schema({
  type: { type: String, enum: ["signup", "login", "booking"], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  email: { type: String },
  name: { type: String },
  detail: { type: String },
  ip: { type: String },
  user_agent: { type: String },
  // Keep six months of history
  created_at: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 180 },
});

activitySchema.index({ created_at: -1 });

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
