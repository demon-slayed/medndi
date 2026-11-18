import { motion } from "framer-motion";
import {
  Heart,
  Star,
  MapPin,
  Activity,
  ThumbsUp,
  Clock,
  Users,
  Stethoscope,
  ArrowRight,
} from "lucide-react";

const HospitalCard = ({ hospital }) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
    >

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900">
              {hospital.hospital_name}
            </h3>
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-semibold text-[#3252DF]">
                {hospital.rating}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin className="w-4 h-4" />
            <p className="text-sm">{hospital.address}</p>
          </div>
          <div className="mt-1 flex items-center gap-1 text-green-600">
            <Activity className="w-4 h-4" />
            <p className="text-xs font-medium">{hospital.accreditation}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {Object.entries(hospital.stats).map(([key, value], idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-2 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
            >
              {idx === 0 && (
                <ThumbsUp className="w-4 h-4 text-[#3252DF] mb-1" />
              )}
              {idx === 1 && <Clock className="w-4 h-4 text-[#3252DF] mb-1" />}
              {idx === 2 && <Users className="w-4 h-4 text-[#3252DF] mb-1" />}
              <span className="text-xs font-semibold text-gray-900">
                {value}
              </span>
              <span className="text-xs text-gray-500 text-center">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
            </div>
          ))}
        </div>

        {/* Specialties */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {hospital.specialties.slice(0, 14).map((specialty, idx) => (
            <div key={idx} className="flex items-center gap-2 group">
              <Stethoscope className="w-3 h-3 text-[#3252DF] group-hover:scale-110 transition-transform" />
              <span className="text-xs text-gray-600 group-hover:text-[#3252DF] transition-colors">
                {specialty}
              </span>
            </div>
          ))}
        </div>

        {/* Treatment Info & CTA */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-xs text-gray-500">Treatment starts from</p>
            <p className="text-lg font-bold text-[#3252DF]">
              ₹{hospital.treatmentCost.toLocaleString()}0
              <span className="text-xs font-normal text-gray-500">
                /procedure
              </span>
            </p>
          </div>
          <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-default"
>
  Booked
  <ArrowRight className="w-4 h-4" />
</motion.button>

        </div>
      </div>
    </motion.div>
  );
};

export default HospitalCard;
