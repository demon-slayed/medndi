import React, { useState, useEffect } from "react";
import { MapPin, Star, Check, ArrowRight, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import LoadingSkelton from "@/components/LoadingSkelton";
import axios from "axios";
import { FALLBACK_IMAGES, withFallback } from "../utils";

const HotelsCards = ({ onHotelSelect, refreshKey }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const fetchedHotels = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/hotels`,
          { withCredentials: true }
        );
        setHotels(fetchedHotels?.data?.hotels);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [refreshKey]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10"
    >
      {loading ? (
        <LoadingSkelton length={6} />
      ) : (
        hotels?.map((hotel, index) => (
          <motion.div
            key={hotel?._id || index}
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
                src={hotel?.image || FALLBACK_IMAGES.hotel}
                onError={withFallback(FALLBACK_IMAGES.hotel)}
                alt={hotel?.hotel_name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">{hotel?.rating}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6">
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

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-sm text-gray-500">per night</span>
                  <div className="text-lg font-semibold text-gray-900">
                    ₹{Number(hotel?.price_per_night || 0).toLocaleString("en-IN")}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onHotelSelect(hotel)}
                  className="inline-flex shrink-0 items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
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
