import PostTreatment from '../models/postTreatmentModel.js';
import { v4 as uuidv4 } from "uuid";
import dotenv from 'dotenv'

dotenv.config()

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
  });

// Create a new post-treatment service
export const createPostTreatment = async (req, res) => {
  try {
    const { service_name, description, service_type, cost } = req.body;

    if (!service_name || !service_type || cost === undefined) {
      return res.status(400).json({ error: "Missing required fields: service_name, service_type, and cost are required." });
    }

    const newService = new PostTreatment({
      post_treatment_id: uuidv4(),
      service_name,
      description,
      service_type,
      cost
    });

    const savedService = await newService.save();
    res.status(201).json({ message: "Post-treatment service added successfully", service: savedService });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all post-treatment services
export const getAllPostTreatments = async (req, res) => {
  try {
    const services = await PostTreatment.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get post-treatment service by ID
export const getPostTreatmentById = async (req, res) => {
  console.log("hii");
  
  try {
    const service = await PostTreatment.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Post-treatment service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a post-treatment service
export const updatePostTreatment = async (req, res) => {
  try {
    const updatedService = await PostTreatment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedService) {
      return res.status(404).json({ message: 'Post-treatment service not found' });
    }
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a post-treatment service
export const deletePostTreatment = async (req, res) => {
  try {
    const deletedService = await PostTreatment.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ message: 'Post-treatment service not found' });
    }
    res.status(200).json({ message: 'Post-treatment service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadFileController = async (req, res)=>{
  console.log(cloudinary.config);
  
  try {
     if(!req.file){
         return res.status(400).send({
             success: false,
             message: "file is missing. Not sent"
         })
     }
             
     if (!process.env.CLOUD_NAME) {
         return res.status(200).send({
             success: true,
             filePath: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
         })
     }

     const uploadResult = await cloudinary.uploader.upload(req.file.path);
     await fs.unlink(req.file.path);

     return res.status(200).send({
         success: true,
         filePath: uploadResult.secure_url
     })

  } catch (error) {
     return res.status(500).send({
         success: false,
         message: "can't upload this file",
         error
      })
  }
}
