import Flight from "../models/flight.js";

// Get All Flights
export const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find().sort({ departure_time: 1 });
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Flight by Flight Number
export const getFlightByNumber = async (req, res) => {
  try {
    const { flight_number } = req.params;
    const flight = await Flight.findOne({ flight_number });

    if (!flight) return res.status(404).json({ error: 'Flight not found' });

    res.json(flight);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Flights by Route (From -> To)
export const getFlightsByRoute = async (req, res) => {
  try {
    let { from, to } = req.query;

    // Validate required parameters
    if (!from || !to) {
      return res.status(400).json({ error: "Missing route parameters" });
    }

    // Trim spaces but keep original case for regex match
    from = from.trim();
    to = to.trim();
    
    if (from.toLowerCase() === to.toLowerCase()) {
      return res.status(400).json({ error: "Departure and arrival locations must be different" });
    }

    const flights = await Flight.find({ 
      from: new RegExp(`^${from}$`, "i"), 
      to: new RegExp(`^${to}$`, "i") 
    }).sort({ departure_time: 1 });

    console.log("flights are: ", flights);

    if (flights.length === 0) {
      return res.status(404).json({ message: "No flights found for the given route" });
    }

    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};



// Create Flight (Admin Only)
export const createFlight = async (req, res) => {
  try {
    const { flight_number, departure_time, arrival_time, airline, from, to } = req.body;

    // Validate required fields
    if (!flight_number || !departure_time || !arrival_time || !airline || !from || !to) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure departure is before arrival
    if (new Date(departure_time) >= new Date(arrival_time)) {
      return res.status(400).json({ error: "Departure time must be before arrival time" });
    }

    // Ensure "from" and "to" locations are different
    if (from.toLowerCase() === to.toLowerCase()) {
      return res.status(400).json({ error: "Departure and arrival locations must be different" });
    }

    // Check if flight already exists
    const flightExists = await Flight.findOne({ flight_number });
    if (flightExists) {
      return res.status(400).json({ error: "Flight number already exists" });
    }

    const newFlight = new Flight({ flight_number, departure_time, arrival_time, airline, from, to });

    await newFlight.save();
    res.status(201).json({ message: "Flight created", flight: newFlight });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update Flight Details (Admin Only)
export const updateFlight = async (req, res) => {
  try {
    const { flight_number } = req.params;
    if (!flight_number) {
      return res.status(400).json({ error: "Flight number is required" });
    }

    const allowedUpdates = ["departure_time", "arrival_time", "airline", "from", "to"];
    const updates = req.body;
    const updateKeys = Object.keys(updates);

    const isValidOperation = updateKeys.every(key => allowedUpdates.includes(key));
    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid update keys provided" });
    }

    if (updates.departure_time && updates.arrival_time) {
      if (new Date(updates.departure_time) >= new Date(updates.arrival_time)) {
        return res.status(400).json({ error: "Departure time must be before arrival time" });
      }
    }

    // If updating locations, ensure they are not the same
    if (updates.from && updates.to) {
      if (updates.from.trim().toLowerCase() === updates.to.trim().toLowerCase()) {
        return res.status(400).json({ error: "Departure and arrival locations must be different" });
      }
    }

    // Find and update the flight, running validators to ensure data consistency
    const updatedFlight = await Flight.findOneAndUpdate(
      { flight_number },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedFlight) {
      return res.status(404).json({ error: "Flight not found" });
    }

    res.json({ message: "Flight updated", flight: updatedFlight });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};


// Delete Flight (Admin Only)
export const deleteFlight = async (req, res) => {
  try {
    const { flight_number } = req.params;

    const deletedFlight = await Flight.findOneAndDelete({ flight_number });

    if (!deletedFlight) return res.status(404).json({ error: 'Flight not found' });

    res.json({ message: 'Flight deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
