import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
    hospital_id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    hospital_name: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    accreditation: { 
        type: String, 
        required: true 
    },
    rating: { 
        type: Number, 
        required: true
    },
    treatmentCost: { 
        type: Number, 
        required: true 
    },
    hospital_image: [{ 
        type: String, 
        required: true 
    }],
    stats: {
        successRate : {
            type: String,
            required: true
        },
        experience : {
            type: String,
            required: true
        },
        patients : {
            type: String,
            required: true
        },
    },
    badges: [{
        type: String,
        required: true
    }],
    specialties: [{
        type: String,
        required: true
    }],
    key_highlights: [{
        label: { type: String, required: true },  
        value: { type: String, required: true },   
        trend: { type: String, required: true } 
    }],
    description: { 
        type: String 
    },
    highlights: [{
        title: { type: String, required: true },
        description: { type: String, required: true }, 
    }],
    amenities: [{
        label: { type: String, required: true },
        description: { type: String, required: true },
    }],
    doctors: [{
        name: { type: String, required: true },
        specialty: { type: String, required: true },
        experience: { type: String, required: true },  
        rating: { type: Number, required: true, min: 0, max: 5 }, 
        image: { type: String, required: true },  
        qualifications: { type: String, required: true },
        expertise: { type: String, required: true }
    }],
    contact_number: { 
        type: String 
    },
    email: { 
        type: String 
    },
    Hotels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel'
    }],
    website: { 
        type: String 
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }

})

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;