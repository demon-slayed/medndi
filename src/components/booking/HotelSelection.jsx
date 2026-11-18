import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Check, ArrowRight } from "lucide-react";
import useAppStore from "@/store/useAppStore";
import toast from "react-hot-toast";
import axios from "axios";
import LoadingSkelton from "../LoadingSkelton";

const FALLBACK_HOTEL_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop";

const HotelSelection = ({ handleNextStep }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const { selectedHotel, setSelectedHotel, hospital } = useAppStore();

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
    toast.success(`${hotel?.hotel_name} selected`);
    handleNextStep();
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const fetchedHotels = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/hotels/hospitalid/${hospital._id}`,
          { withCredentials: true }
        );
        setHotels(Array.isArray(fetchedHotels?.data) ? fetchedHotels.data : []);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    if (hospital?._id) {
      fetchHotels();
    } else {
      setLoading(false);
    }
  }, [hospital?._id]);

  return (
    <div className="relative bg-gradient-to-b from-[#ECF1FF] to-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20 -top-20 -left-20"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 -bottom-20 -right-20"
        />
      </div>

      <div className="relative px-6 md:px-16 lg:px-40 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-poppins font-bold text-5xl max-lg:text-4xl max-md:text-3xl text-[#283841]">
            Select Medical Stay{" "}
            <span className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">
              Near Hospital
            </span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Discover comfortable accommodations near top healthcare facilities
            with special medical stay packages
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {loading ? (
            <LoadingSkelton length={6} />
          ) : hotels.length === 0 ? (
            <div className="col-span-full text-center bg-white rounded-2xl shadow p-10">
              <h3 className="font-semibold text-lg text-[#152C5B]">
                No partner hotels listed for this hospital yet
              </h3>
              <p className="mt-2 text-gray-600">
                Click <span className="font-medium">Next</span> to continue. Our team can help arrange a stay.
              </p>
            </div>
          ) : (
            hotels.map((hotel, index) => (
              <motion.div
                key={hotel?._id ?? index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
                  selectedHotel?._id === hotel?._id ? "ring-4 ring-[#3252DF]/30 border-2 border-[#3252DF]" : ""
                }`}
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hotel?.image || FALLBACK_HOTEL_IMAGE}
                    onError={(e) => { e.currentTarget.src = FALLBACK_HOTEL_IMAGE; }}
                    alt={hotel?.hotel_name || "Hotel"}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
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
                        <p className="text-gray-600 text-sm">
                          {hotel?.location}
                        </p>
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
                    {hotel?.distance && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span>{hotel.distance} from hospital</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500">per night</span>
                      <div className="text-lg font-semibold text-gray-900">
                        {hotel?.price_per_night != null
                          ? `₹${hotel.price_per_night.toLocaleString()}`
                          : "On request"}
                      </div>
                    </div>
                    <button
                      className="flex items-center gap-1 text-[#3252DF] text-sm font-medium group-hover:gap-2 transition-all duration-300"
                      onClick={() => handleHotelSelect(hotel)}
                    >
                      {selectedHotel?._id === hotel?._id ? (
                        <>
                          <Check className="w-4 h-4" />
                          Selected · continue
                        </>
                      ) : (
                        <>
                          Select Hotel
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HotelSelection;
