import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    hotel_id: { 
        type: String, 
        required: true,
         unique: true 
    },
    image: {
        type: String,
    },
    hotel_name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    location: { 
        type: String 
    },
    distance: {
        type: String,
    },
    price_per_night: { 
        type: Number 
    },
    rating: { 
        type: Number, 
        min: 1, 
        max: 5 
    },
    hospital_id : {  // associated with
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    },
    amenities: [String],  // e.g., Free WiFi, Pool, Gym
    hospital_nearby: [{ 
        type: String, 
        ref: 'Hospital' 
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }


})

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;