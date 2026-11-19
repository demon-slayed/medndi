import mongoose from "mongoose";

const treatmentSchema = new mongoose.Schema({
        treatment_id: { 
            type: String, 
            required: true, 
            unique: true 
        },
        image: {
            type: String,
            required: true
        },
        treatment_name: {   // treatment_title
            type: String, 
            required: true 
        },
        location : {
            type: String,
            required: true,
        },
        rating: { 
            type: Number, 
            required: true
        },
        estimated_cost: {
            min: { type: Number, required: true },
            max: { type: Number, required: true }
        },
        email: {
             type: String,
             required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        duration: { 
            type: String
        },
        success_rate : {
            type: String,
            required: true
        },
        features : [{
            type: String,
            required: true
        }],
        available_hospitals: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Hospital' 
        }],
        // main card
        patients : {
            type: String,
            required: true
        },
        tags : {
            type: String,
            required: true
        },
        // home page 
        experience : {
            type: String,
            required: true
        },
        support : {
            type: String,
            required: true
        },
        description: { 
            type: String 
        },
        category: { 
            type: String
        },
        created_at: { 
            type: Date, 
            default: Date.now },
        updated_at: { 
            type: Date, 
            default: Date.now 
        }
})

const Treatment = mongoose.model('Treatment', treatmentSchema);

export default Treatment;