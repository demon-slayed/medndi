import mongoose from 'mongoose';

const travelPlanSchema = new mongoose.Schema({
  travel_plan_id: { type: String, required: true, unique: true },
  flight_details: {
    flight_number: { type: String, required: true },
    departure_time: { type: Date, required: true },
    arrival_time: { type: Date, required: true },
    airline: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true }
  },
  transport: {
    transport_type: { type: String, enum: ['Car', 'Bus', 'Taxi'], required: true },
    pick_up_time: { type: Date, required: true },
    drop_off_time: { type: Date, required: true }
  },
  translator_available: { type: Boolean, default: false },
  pricing: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const TravelPlan = mongoose.model('TravelPlan', travelPlanSchema);
export default TravelPlan;
