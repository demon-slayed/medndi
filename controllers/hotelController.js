import mongoose from "mongoose";
import Hotel from "../models/hotelSchema.js";
import Hospital from "../models/hospitalModel.js";


// create Hotel
export const createHotelController = async(req,res) => {
    try {
       const { hotel_id, hotel_name } = req.body;
       if(!hotel_id){ 
           return res.status(400).send("hotel_id field is missing")
       }
       if(!hotel_name) {
           return res.status(400).send("hotel_name field is missing")
       }
       const hotel = await Hotel.create(req.body);
       return res.status(201).json({
           success: true,
           message: "Hotel created successfully",
           hotel
       })
       
    } catch (error) {
       return res.status(500).json({
           success: false,
           message: 'Server error while creating hotel!',
           error
        });
    }
}

// get All Hotel
export const getAllHotelsController = async(req, res) => {
    try {
        const hotels = await Hotel.find().populate("hospital_id", "hospital_nearby");
        return res.status(200).json({
            success: true,
            message: "All Hotels fetched successfullly",
            hotels
        })       
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching All Hotels!',
            error
        });
    }
}

// get Hotel by id
export const getHotelByIdController = async(req, res) => {
    try {        
        const { hotel_id } = req.params;
        const hotel = await Hotel.findOne({hotel_id}).populate("hospital_id", "hospital_nearby");
        if(!hotel){
            return res.status(404).json({
                success: false,
                message: "No Hotel found"
            })
        }
        return res.status(200).send({
            success: true,
            message: "Hotel fetched successfully",
            hotel
        })       
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching hotel!',
            error
        });
    }
}

// get hotel by hospital id
export const getHotelsByHospital = async (req, res) => {
    try {
      const { hospital_id } = req.params;
  
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(hospital_id)) {
        return res.status(400).json({ error: "Invalid hospital ID" });
      }
  
      const hospital = await Hospital.findById(hospital_id).populate("Hotels");
      if (!hospital) {
        return res.status(404).json({ error: "Hospital not found" });
      }
  
      res.status(200).json(hospital.Hotels);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      res.status(500).json({ error: "Server error" });
    }
  };


// update Hotel
export const updateHotelController = async(req, res) => {
    try {        
        const { _id } = req.params;
        const hotel = await Hotel.findOneAndUpdate(
            {_id},
            {$set: {...req.body} },
            {new: true, runValidators: true}
        )
        if(!hotel){
            return res.status(404).json({
                success: false,
                message: "Something went wrong, not updated"
            })
        }
        return res.status(200).send({
            success: true,
            message: "Hotel data updated successfully",
            hotel
        })       
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error while updating Hotel data!',
            error
        });
    }
}

// Delete Hotel
export const deleteHotelController = async(req, res) => {
    try {        
        const { _id } = req.params;
        const hotel = await Hotel.findOneAndDelete({_id})
        return res.status(200).send({
            success: true,
            message: "hotel deleted successfully",
            hotel
        })       
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error while deleting hotel data!',
            error
        });
    }
}
