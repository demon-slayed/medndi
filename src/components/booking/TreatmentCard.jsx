import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Star,
  IndianRupee,
  Clock,
  CheckCircle2,
  ArrowRight,
  Activity,
  Mail,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TreatmentCard = ({ treatment }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();


  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer mb-6"
    >
      {/* Image */}
      {/* <div className="relative h-48 overflow-hidden">
        <img
          src={treatment?.image}
          alt={treatment?.treatment_name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium">{treatment?.rating}</span>
        </div>
      </div> */}

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
              {treatment?.estimated_cost?.min?.toLocaleString()} - {treatment?.estimated_cost?.max?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Duration: {treatment?.duration}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {treatment?.features?.map((feature, idx) => (
            <span key={idx} className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600">
              {feature}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">Success Rate: {treatment?.success_rate}</span>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300">
            Booked
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Hover overlay */}
      <motion.div
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 20 }}
        className="absolute inset-0 bg-gradient-to-t from-[#3252DF]/90 to-[#4466ff]/90 flex items-center justify-center opacity-0 transition-opacity duration-300 max-sm:hidden"
      >
        <div className="text-white text-center p-6">
          <Activity className="w-12 h-12 mx-auto mb-4" />
          <h4 className="font-semibold text-xl mb-2">Contact Specialists</h4>
          <div className="space-y-2 mb-4">
            <p className="text-sm flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              {treatment?.email}
            </p>
            <p className="text-sm flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              {treatment?.phone}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TreatmentCard;
