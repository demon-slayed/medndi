import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  flight_number: { type: String, required: true, unique: true },
  departure_time: { type: Date, required: true },
  arrival_time: { type: Date, required: true },
  airline: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true }
});

const Flight = mongoose.model('Flight', flightSchema);
export default Flight;
