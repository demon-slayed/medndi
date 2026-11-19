import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Mail, Phone, ArrowRight, Activity, Clock, IndianRupee, CheckCircle2 } from 'lucide-react';

export const FALLBACK_TREATMENT_IMAGE =
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop";

const formatCost = (cost) => {
  const min = Number(cost?.min);
  const max = Number(cost?.max);
  if (Number.isFinite(min) && Number.isFinite(max) && max > min) {
    return `${min.toLocaleString()} - ${max.toLocaleString()}`;
  }
  if (Number.isFinite(min) && min > 0) return `${min.toLocaleString()} onwards`;
  return null;
};

/**
 * Treatment card shared by /treatments and /hospital/:id/treatments.
 * Clicking the card opens the treatment details; the CTA calls `onCtaClick`.
 */
const TreatmentCard = ({ treatment, index, hovered, onHoverChange, onOpen, ctaLabel, onCtaClick, variants }) => {
  const cost = formatCost(treatment?.estimated_cost);

  return (
    <motion.div
      variants={variants}
      onClick={() => onOpen(treatment)}
      onHoverStart={() => onHoverChange(index)}
      onHoverEnd={() => onHoverChange(null)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={treatment?.image || FALLBACK_TREATMENT_IMAGE}
          onError={(e) => { e.currentTarget.src = FALLBACK_TREATMENT_IMAGE; }}
          alt={treatment?.treatment_name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {treatment?.rating != null && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{treatment.rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-poppins font-semibold text-xl text-[#152C5B] mb-2">
          {treatment?.treatment_name}
        </h3>

        {treatment?.location && (
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-[#3252DF]" />
            <p className="text-gray-600 text-sm">{treatment.location}</p>
          </div>
        )}

        <div className="space-y-2 mb-4">
          {cost && (
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{cost}</span>
            </div>
          )}
          {treatment?.duration && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Duration: {treatment.duration}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(treatment?.features ?? []).map((feature, idx) => (
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
            {treatment?.success_rate && (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Success Rate: {treatment.success_rate}</span>
              </>
            )}
          </div>

          <button
            className="px-4 py-2 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:shadow-lg transition-shadow"
            onClick={(e) => {
              e.stopPropagation();
              onCtaClick(treatment);
            }}
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hover overlay */}
      <motion.div
        initial={false}
        animate={{
          opacity: hovered ? 1 : 0,
          y: hovered ? 0 : 20
        }}
        className={`absolute inset-0 bg-gradient-to-t from-[#3252DF]/90 to-[#4466ff]/90 flex items-center justify-center opacity-0 transition-opacity duration-300 max-sm:hidden ${hovered ? "" : "pointer-events-none"}`}
      >
        <div className="text-white text-center p-6">
          <Activity className="w-12 h-12 mx-auto mb-4" />
          <h4 className="font-semibold text-xl mb-2">Contact Specialists</h4>
          <div className="space-y-2 mb-4">
            {treatment?.email && (
              <p className="text-sm flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                {treatment.email}
              </p>
            )}
            {treatment?.phone && (
              <p className="text-sm flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                {treatment.phone}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              className="bg-white text-[#3252DF] px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation();
                onCtaClick(treatment);
              }}
            >
              {ctaLabel}
            </button>
            <button
              className="border border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(treatment);
              }}
            >
              View Details
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TreatmentCard;
