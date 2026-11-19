import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Activity,
  ThumbsUp,
  Clock,
  Users,
  Stethoscope,
  ArrowRight,
  Pencil,
} from "lucide-react";
import axios from "axios";
import { FALLBACK_IMAGES, withFallback } from "../utils";

// const hospitals = [
//   {
//     hospital_name: "Apollo Hospital",
//     rating: 4.7,
//     address: "New Delhi, India",
//     accreditation: "NABH Accredited",
//     hospital_image: ["https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1773"],
//     badges: ["Top Rated", "24x7 Support"],
//     stats: {
//       Recommendations: "95%",
//       "Avg. Waiting Time": "20 mins",
//       Patients: "5000+",
//     },
//     specialties: ["Cardiology", "Orthopedics", "Neurology", "Oncology", "Pediatrics"],
//     treatmentCost: 75000,
//     treatments: {
//       upcoming: "Next slot: Apr 15, 10:00 AM",
//       duration: "3 hours",
//     },
//   },
//   // Add more hospital objects as needed
// ];

const HospitalCards = ({ onHospitalSelect, refreshKey }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/hospitals`
        );
        console.log(response.data);

        setHospitals(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchHospitals();
  }, [refreshKey]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
      {hospitals?.map((hospital, index) => (
        <motion.div
          key={hospital?._id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -10 }}
          onHoverStart={() => setHoveredCard(index)}
          onHoverEnd={() => setHoveredCard(null)}
          className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
        >
          {/* Image Section */}
          <div className="relative h-48">
            <motion.img
              src={hospital?.hospital_image?.[0] || FALLBACK_IMAGES.hospital}
              onError={withFallback(FALLBACK_IMAGES.hospital)}
              alt={hospital.hospital_name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {hospital?.badges?.map((badge, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#3252DF]"
                >
                  {badge}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6">
            <div className="mb-4">
              <div className="flex justify-between items-start gap-3 mb-2">
                <h3 className="min-w-0 text-lg font-bold text-gray-900">
                  {hospital.hospital_name}
                </h3>
                <div className="flex shrink-0 items-center gap-1 px-2 py-1 bg-blue-50 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold text-[#3252DF]">
                    {hospital.rating}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-1 text-gray-500">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="text-sm">{hospital.address}</p>
              </div>
              <div className="mt-1 flex items-center gap-1 text-green-600">
                <Activity className="w-4 h-4" />
                <p className="text-xs font-medium">{hospital.accreditation}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {Object.entries(hospital?.stats || {}).map(([key, value], idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2 }}
                  className="flex flex-col items-center p-2 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
                >
                  {idx === 0 && (
                    <ThumbsUp className="w-4 h-4 text-[#3252DF] mb-1" />
                  )}
                  {idx === 1 && (
                    <Clock className="w-4 h-4 text-[#3252DF] mb-1" />
                  )}
                  {idx === 2 && (
                    <Users className="w-4 h-4 text-[#3252DF] mb-1" />
                  )}
                  <span className="text-xs font-semibold text-gray-900">
                    {value}
                  </span>
                  <span className="text-xs text-gray-500 text-center">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Specialties */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {hospital?.specialties?.slice(0, 6).map((specialty, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 2 }}
                  className="flex items-center gap-2 group"
                >
                  <Stethoscope className="w-3 h-3 shrink-0 text-[#3252DF] group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-gray-600 group-hover:text-[#3252DF] transition-colors">
                    {specialty}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Treatment Info & CTA */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Treatment starts from</p>
                <p className="text-lg font-bold text-[#3252DF]">
                  ₹{hospital?.treatmentCost?.toLocaleString("en-IN")}
                  <span className="text-xs font-normal text-gray-500">
                    /procedure
                  </span>
                </p>
              </div>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
                onClick={() => onHospitalSelect(hospital)}
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default HospitalCards;
