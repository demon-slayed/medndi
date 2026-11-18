import TravelPlan from '../models/travelModel.js';
import { v4 as uuidv4 } from 'uuid';

// Get All Travel Plans
export const getAllTravelPlans = async (req, res) => {
  try {
    const travelPlans = await TravelPlan.find().sort({ created_at: -1 });
    res.json(travelPlans);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Travel Plan by ID
export const getTravelPlanById = async (req, res) => {
  try {
    const { travel_plan_id } = req.params;
    const travelPlan = await TravelPlan.findOne({ travel_plan_id });

    if (!travelPlan) return res.status(404).json({ error: 'Travel plan not found' });

    res.json(travelPlan);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create Travel Plan (Admin Only)
export const createTravelPlan = async (req, res) => {  
  try {
    const { flight_details, transport, translator_available, pricing } = req.body;

    if (!flight_details || !transport || pricing === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newTravelPlan = new TravelPlan({
      travel_plan_id: uuidv4(),
      flight_details,
      transport,
      translator_available,
      pricing
    });

    await newTravelPlan.save();
    res.status(201).json({ message: 'Travel plan created', travel_plan: newTravelPlan });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update Travel Plan (Admin Only)
export const updateTravelPlan = async (req, res) => {
  try {
    const { travel_plan_id } = req.params;
    const updates = { ...req.body, updated_at: Date.now() };

    const updatedTravelPlan = await TravelPlan.findOneAndUpdate({ travel_plan_id }, updates, { new: true });

    if (!updatedTravelPlan) return res.status(404).json({ error: 'Travel plan not found' });

    res.json({ message: 'Travel plan updated', travel_plan: updatedTravelPlan });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete Travel Plan (Admin Only)
export const deleteTravelPlan = async (req, res) => {
  try {
    const { travel_plan_id } = req.params;

    const deletedTravelPlan = await TravelPlan.findOneAndDelete({ travel_plan_id });

    if (!deletedTravelPlan) return res.status(404).json({ error: 'Travel plan not found' });

    res.json({ message: 'Travel plan deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
