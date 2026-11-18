import React, { useState, useEffect } from "react";
import { MapPin, Star, Heart, Check, ArrowRight, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import LoadingSkelton from "@/components/LoadingSkelton";
import axios from "axios";

const HotelsCards = ({ onHotelSelect }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        console.log("hii");
        const fetchedHotels = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/hotels`,
          { withCredentials: true }
        );
        setHotels(fetchedHotels?.data?.hotels);
        console.log("hotels is: ", fetchedHotels?.data?.hotels);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
    >
      {loading ? (
        <LoadingSkelton length={6} />
      ) : (
        hotels?.map((hotel, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt={hotel?.hotel_name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <button
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                onClick={() => {}}
              >
                <Heart className="w-5 h-5 text-red-500" />
              </button>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">{hotel?.rating}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-poppins font-semibold text-xl text-[#152C5B]">
                    {hotel?.hotel_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-[#3252DF]" />
                    <p className="text-gray-600 text-sm">{hotel?.location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {hotel?.amenities?.slice(0, 7).map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{amenity}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>{hotel?.distance}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">per night</span>
                  <div className="text-lg font-semibold text-gray-900">
                    ₹{hotel?.price_per_night}
                  </div>
                </div>
                <button
                  onClick={() => onHotelSelect(hotel)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-[#3252DF] border border-[#3252DF] rounded-full shadow-sm hover:bg-[#3252DF] hover:text-white transition-all duration-300"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default HotelsCards;
