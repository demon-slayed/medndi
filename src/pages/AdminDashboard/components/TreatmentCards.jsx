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
} from "lucide-react";

import axios from "axios";
import LoadingSkelton from "@/components/LoadingSkelton";

const TreatmentCards = ({onTreatmentSelect}) => {
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
  }, []);

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
    <div className="relative w-full lg:py-24">
      <motion.div
        variants={containerVariants}
        whileInView="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {loading ? (
          <LoadingSkelton length={12} />
        ) : (
          treatments &&
          treatments?.map((treatment, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  // src={treatment?.image}
                  src="https://plus.unsplash.com/premium_photo-1664456804517-f6347600b764?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
              <div className="p-6">
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
                      {treatment?.estimated_cost?.min}-
                      {treatment?.estimated_cost?.max}
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">
                      Success Rate: {treatment?.success_rate}
                    </span>
                  </div>

                  <button className="px-5 py-2.5 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-full text-sm font-semibold flex items-center gap-2 hover:shadow-xl hover:scale-[1.03] transition-all duration-200 ease-in-out"
                   onClick={()=>{onTreatmentSelect(treatment)}}
                  >
                    Edit
                    <ArrowRight className="w-4 h-4" />
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
