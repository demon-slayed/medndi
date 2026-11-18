import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
    user_id: { 
        type: String, 
        unique: true,
        default: () => uuidv4() 
    },
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Others"], required: true },
    date_of_birth: { type: Date },
    role: { type: String, enum: ["Admin", "User"], default: 'User' },
    address: { type: String },
    nationality: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
