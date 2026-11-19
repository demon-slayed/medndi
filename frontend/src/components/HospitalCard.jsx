import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Activity, ThumbsUp, Clock, Users, Stethoscope, ArrowRight } from "lucide-react";

const FALLBACK_HOSPITAL_IMAGE =
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80";

const STAT_FIELDS = [
  { key: "successRate", label: "Success Rate", icon: ThumbsUp },
  { key: "experience", label: "Experience", icon: Clock },
  { key: "patients", label: "Patients", icon: Users },
];

/**
 * Hospital summary card.
 * - Default CTA: "View Details" -> /hospital-details/:hospital_id
 * - Pass `ctaLabel` + `onCtaClick(hospital)` to override (e.g. booking from a treatment page).
 */
const HospitalCard = ({ hospital, index = 0, setHoveredCard, ctaLabel, onCtaClick }) =>{

  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/hospital-details/${hospital?.hospital_id}`);
    window.scrollTo({top:0, behavior: "smooth"})
  }

  const handleCtaClick = () => {
    if (onCtaClick) onCtaClick(hospital);
    else goToDetails();
  }

  const stats = STAT_FIELDS.filter(({ key }) => hospital?.stats?.[key]);
  const cost = Number(hospital?.treatmentCost);

  return(
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      onHoverStart={() => setHoveredCard?.(index)}
      onHoverEnd={() => setHoveredCard?.(null)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      {/* Image Section */}
      <div className="relative h-48 cursor-pointer" onClick={goToDetails}>
        <motion.img
          src={hospital?.hospital_image?.[0] || FALLBACK_HOSPITAL_IMAGE}
          onError={(e) => { e.currentTarget.src = FALLBACK_HOSPITAL_IMAGE; }}
          alt={hospital?.hospital_name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {(hospital?.badges ?? []).map((badge, idx) => (
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
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-between items-start gap-3 mb-2">
            <h3 className="text-lg font-bold text-gray-900 cursor-pointer hover:text-[#3252DF]" onClick={goToDetails}>
              {hospital?.hospital_name}
            </h3>
            {hospital?.rating != null && (
              <div className="flex shrink-0 items-center gap-1 px-2 py-1 bg-blue-50 rounded-full">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-semibold text-[#3252DF]">{hospital.rating}</span>
              </div>
            )}
          </div>
          {hospital?.address && (
            <div className="flex items-start gap-1 text-gray-500">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="text-sm line-clamp-2">{hospital.address}</p>
            </div>
          )}
          {hospital?.accreditation && (
            <div className="mt-1 flex items-center gap-1 text-green-600">
              <Activity className="w-4 h-4" />
              <p className="text-xs font-medium">{hospital.accreditation}</p>
            </div>
          )}
        </div>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {stats.map(({ key, label, icon: Icon }) => (
              <motion.div
                key={key}
                whileHover={{ y: -2 }}
                className="flex flex-col items-center p-2 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
              >
                <Icon className="w-4 h-4 text-[#3252DF] mb-1" />
                <span className="text-xs font-semibold text-gray-900">{hospital.stats[key]}</span>
                <span className="text-xs text-gray-500 text-center">{label}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Specialties */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {(hospital?.specialties ?? []).slice(0,6).map((specialty, idx) => (
            <motion.div
              key={idx}
              whileHover={{ x: 2 }}
              className="flex items-center gap-2 group min-w-0"
            >
              <Stethoscope className="w-3 h-3 shrink-0 text-[#3252DF] group-hover:scale-110 transition-transform" />
              <span className="text-xs text-gray-600 group-hover:text-[#3252DF] transition-colors truncate">{specialty}</span>
            </motion.div>
          ))}
        </div>

        {/* Treatment Info & CTA */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t">
          <div>
            {Number.isFinite(cost) && cost > 0 && (
              <>
                <p className="text-xs text-gray-500">Treatment starts from</p>
                <p className="text-lg font-bold text-[#3252DF]">
                  ₹{cost.toLocaleString("en-IN")}
                  <span className="text-xs font-normal text-gray-500">/procedure</span>
                </p>
              </>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="shrink-0 px-4 py-2 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:shadow-lg transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
            onClick={handleCtaClick}
          >
            {ctaLabel || "View Details"}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )};


  export default HospitalCard;
