import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Mail,
  Phone,
  ArrowRight,
  Activity,
  Clock,
  IndianRupee,
  CheckCircle2,
  Pencil,
} from "lucide-react";

import axios from "axios";
import LoadingSkelton from "@/components/LoadingSkelton";
import { FALLBACK_IMAGES, withFallback } from "../utils";

const TreatmentCards = ({ onTreatmentSelect, refreshKey }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  // console.log("treatment from context is: ", treatments);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setLoading(true); // start loading
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/treatments`
        );
        setTreatments(response?.data);
        console.log("treatments: ", response?.data);
      } catch (error) {
        console.error("Error fetching treatments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, [refreshKey]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    // <div className="relative bg-gradient-to-b from-[#ECF1FF] to-white overflow-hidden min-h-screen mt-16">
    <div className="relative w-full">
      <motion.div
        variants={containerVariants}
        whileInView="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10"
      >
        {loading ? (
          <LoadingSkelton length={12} />
        ) : (
          treatments &&
          treatments?.map((treatment, index) => (
            <motion.div
              key={treatment?._id || index}
              variants={itemVariants}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={treatment?.image || FALLBACK_IMAGES.treatment}
                  onError={withFallback(FALLBACK_IMAGES.treatment)}
                  alt={treatment?.treatment_name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">
                    {treatment?.rating}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <h3 className="font-poppins font-semibold text-xl text-[#152C5B] mb-2">
                  {treatment?.treatment_name}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-[#3252DF]" />
                  <p className="text-gray-600 text-sm">{treatment?.location}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {Number(treatment?.estimated_cost?.min || 0).toLocaleString("en-IN")} –{" "}
                      {Number(treatment?.estimated_cost?.max || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Duration: {treatment?.duration}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {treatment?.features?.map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
                    <span className="text-sm text-gray-600">
                      Success Rate: {treatment?.success_rate}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
                    onClick={() => onTreatmentSelect(treatment)}
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
    </div>
    // </div>
  );
};

export default TreatmentCards;
