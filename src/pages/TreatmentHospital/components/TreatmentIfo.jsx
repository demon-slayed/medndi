import React from "react";

import { motion } from "framer-motion";
import useAppStore from "@/store/useAppStore";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Users,
  Hospital,
  Award,
  Clock,
  ChevronRight,
  ThumbsUp,
  Stethoscope,
  Calendar,
  Phone,
  ArrowRight,
  MapPin,
  Home,
  HeartPulse,
} from "lucide-react";

export const BreadcrumbItem = ({ children, isLast }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center"
  >
    <span
      className={`${
        isLast
          ? "text-gray-600"
          : "text-[#3252DF] hover:text-[#4466ff] cursor-pointer"
      }`}
    >
      {children}
    </span>
    {!isLast && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
  </motion.div>
);

const scrollToHospitals = () => {
  document.getElementById("treatment-hospitals")?.scrollIntoView({ behavior: "smooth" });
};

const TreatmentInfo = ({ treatment, loading, error }) => {
  const { setHospital } = useAppStore();
  const navigate = useNavigate();

  const hospitals = (treatment?.available_hospitals ?? []).filter(
    (h) => h && typeof h === "object"
  );
  const minCost = Number(treatment?.estimated_cost?.min);
  const maxCost = Number(treatment?.estimated_cost?.max);

  // Booking reads store.treatment (set by the page) + store.hospital.
  const handleBook = () => {
    if (hospitals.length === 1) {
      setHospital(hospitals[0]);
      navigate("/booking");
    } else if (hospitals.length > 1) {
      scrollToHospitals();
    } else {
      navigate("/contact");
    }
  };

  const PageBreadcrumb = () => (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-8 py-4 ">
        <div className="flex items-center justify-between max-sm:mt-4">
          <div className="flex items-center flex-wrap gap-2 text-sm max-sm:text-xs">
            <BreadcrumbItem>
              <Home
                className="w-4 h-4"
                onClick={() => {
                  navigate("/");
                }}
              />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <span onClick={() => navigate("/treatments")}>Medical Treatments</span>
            </BreadcrumbItem>
            <BreadcrumbItem isLast>{treatment?.treatment_name || "Treatment Info"}</BreadcrumbItem>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate("/contact");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#3252DF]/10 rounded-lg text-[#3252DF]"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm max-sm:text-xs font-medium">
                Get Expert Help
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );

  const HeroSection = () => {
    const badges = [
      treatment?.category && { icon: Award, text: treatment.category, color: "text-[#3252DF]" },
      treatment?.rating != null && {
        icon: Star,
        text: `${treatment.rating}/5 rating`,
        color: "text-yellow-500",
      },
      treatment?.tags && { icon: HeartPulse, text: treatment.tags, color: "text-green-500" },
    ].filter(Boolean);

    const stats = [
      treatment?.success_rate && {
        icon: ThumbsUp,
        value: treatment.success_rate,
        label: "Success Rate",
        sublabel: treatment?.patients ? `${treatment.patients} patients` : "Proven outcomes",
      },
      {
        icon: Hospital,
        value: String(hospitals.length),
        label: hospitals.length === 1 ? "Partner Hospital" : "Partner Hospitals",
        sublabel: "Accredited network",
      },
      treatment?.experience && {
        icon: Clock,
        value: treatment.experience,
        label: "Experience",
        sublabel: "Expert surgeons",
      },
      {
        icon: Users,
        value: treatment?.support || "24/7",
        label: "Support",
        sublabel: "Always available",
      },
    ].filter(Boolean);

    return (
      <div className="space-y-8 max-sm:mx-auto max-sm:items-center max-sm:text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {treatment?.image && (
            <img
              src={treatment.image}
              alt={treatment?.treatment_name}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
              className="w-full h-64 object-cover rounded-2xl shadow-lg"
            />
          )}

          {treatment?.features?.length > 0 && (
            <div>
              {treatment.features.map((feature, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full mr-2 mb-2"
                >
                  <Stethoscope className="w-4 h-4 text-[#3252DF] mr-2" />
                  <span className="text-sm font-medium text-[#3252DF]">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold max-sm:text-3xl">
              <span className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">
                {treatment?.treatment_name}
              </span>
            </h1>
            {treatment?.location && (
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-[#3252DF]" />
                <p className="text-gray-600 text-lg">{treatment.location}</p>
              </div>
            )}
            {treatment?.description && (
              <p className="text-lg text-gray-600 max-w-2xl max-sm:text-base">
                {treatment.description}
              </p>
            )}
          </div>

          {badges.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 max-sm:justify-center">
              {badges.map((badge, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm"
                >
                  <badge.icon className={`w-5 h-5 ${badge.color}`} />
                  <span className="font-medium">{badge.text}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 shadow-lg group hover:shadow-xl transition-all"
            >
              <div className="space-y-3 max-md:flex flex-col items-center">
                <stat.icon className="w-8 h-8 text-[#3252DF] flex self-center" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-700">
                    {stat.label}
                  </p>
                  <p className="text-xs text-gray-500">{stat.sublabel}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  };

  const BookingCard = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky top-24"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-md:mx-auto">
        <div className="p-6 space-y-6">
          {Number.isFinite(minCost) && minCost > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-[#3252DF] font-medium">
                Treatment Cost
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">
                  ₹{minCost.toLocaleString()}
                </span>
                <span className="text-gray-500">onwards</span>
              </div>
              {Number.isFinite(maxCost) && maxCost > minCost && (
                <p className="text-sm text-gray-600">
                  Typical range ₹{minCost.toLocaleString()} - ₹{maxCost.toLocaleString()}
                </p>
              )}
            </div>
          )}

          <div className="space-y-4">
            {[
              treatment?.duration && {
                icon: Calendar,
                text: `Duration: ${treatment.duration}`,
                color: "text-purple-600",
              },
              {
                icon: Hospital,
                text: `${hospitals.length} partner ${hospitals.length === 1 ? "hospital" : "hospitals"}`,
                color: "text-blue-600",
              },
              treatment?.phone && {
                icon: Phone,
                text: treatment.phone,
                color: "text-green-600",
              },
            ]
              .filter(Boolean)
              .map((info, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3"
                >
                  <div className={`p-2 rounded-lg bg-gray-50 ${info.color}`}>
                    <info.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-gray-600">{info.text}</span>
                </motion.div>
              ))}
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
              onClick={handleBook}
            >
              {hospitals.length > 1
                ? "Choose a Hospital"
                : hospitals.length === 1
                ? "Book Consultation"
                : "Enquire Now"}
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 border-2 border-[#3252DF] text-[#3252DF] rounded-xl font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              onClick={() => {
                navigate("/contact");
              }}
            >
              <Phone className="w-4 h-4" />
              Talk to Expert
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderBody = () => {
    if (loading) {
      return (
        <div className="grid lg:grid-cols-3 gap-12 animate-pulse">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 rounded-2xl" />
            <div className="h-10 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white rounded-xl shadow" />
              ))}
            </div>
          </div>
          <div className="h-80 bg-white rounded-2xl shadow" />
        </div>
      );
    }

    if (error || !treatment) {
      return (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Stethoscope className="w-12 h-12 text-[#3252DF] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error === "notfound" ? "Treatment not found" : "Couldn't load this treatment"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error === "notfound"
              ? "This treatment may have been removed or the link is incorrect."
              : "Please check your connection and try again."}
          </p>
          <button
            onClick={() => navigate("/treatments")}
            className="px-6 py-3 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-xl font-medium"
          >
            Browse all treatments
          </button>
        </div>
      );
    }

    return (
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <HeroSection />
        </div>
        <div className="lg:col-span-1">
          <BookingCard />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3252DF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4466ff]/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative">
        <PageBreadcrumb />

        <div className="max-w-7xl mx-auto px-8 py-12 items-center">
          {renderBody()}
        </div>
      </div>
    </div>
  );
};

export default TreatmentInfo;
