import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  payment_id: { type: String, required: true, unique: true },
  application_id: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
  amount: { type: Number, required: true },
  payment_status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
  payment_date: { type: Date, default: Date.now },
  payment_gateway: { type: String, enum: ["Razorpay", "Stripe"], required: true },
  payment_details: {
    payment_id: { type: String},
    transaction_id: { type: String} 
  }
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
