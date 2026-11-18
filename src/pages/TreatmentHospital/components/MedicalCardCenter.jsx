import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Building2,
  ChevronDown,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  X,
} from "lucide-react";
import HospitalCard from "@/components/HospitalCard";
import useAppStore from "@/store/useAppStore";

const SORT_OPTIONS = ["Recommended", "Price: Low to High", "Price: High to Low", "Rating"];

const sortHospitals = (list, sortBy) => {
  const sorted = [...list];
  switch (sortBy) {
    case "Price: Low to High":
      return sorted.sort((a, b) => (a?.treatmentCost ?? Infinity) - (b?.treatmentCost ?? Infinity));
    case "Price: High to Low":
      return sorted.sort((a, b) => (b?.treatmentCost ?? -Infinity) - (a?.treatmentCost ?? -Infinity));
    case "Rating":
      return sorted.sort((a, b) => (b?.rating ?? 0) - (a?.rating ?? 0));
    default:
      return sorted;
  }
};

// Hospitals offering the current treatment (treatment.available_hospitals is populated by the API)
const MedicalCardCenter = ({ treatment }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sortBy, setSortBy] = useState("Recommended");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [search, setSearch] = useState("");
  const { setTreatment, setHospital } = useAppStore();
  const navigate = useNavigate();

  const availableHospitals = useMemo(
    () =>
      (treatment?.available_hospitals ?? []).filter(
        (h) => h && typeof h === "object"
      ),
    [treatment]
  );

  const visibleHospitals = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? availableHospitals.filter((h) =>
          [h?.hospital_name, h?.address, h?.accreditation, ...(h?.specialties ?? [])]
            .filter(Boolean)
            .some((field) => String(field).toLowerCase().includes(q))
        )
      : availableHospitals;
    return sortHospitals(filtered, sortBy);
  }, [availableHospitals, search, sortBy]);

  // Booking reads store.treatment + store.hospital
  const handleBook = (hospital) => {
    setTreatment(treatment);
    setHospital(hospital);
    navigate("/booking");
  };

  return (
    <div id="treatment-hospitals" className="px-6 md:px-16 p-10 lg:px-24 bg-gradient-to-b from-white to-blue-50 scroll-mt-32">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        {/* Title and Description */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="h-10 w-1.5 rounded-full bg-gradient-to-b from-[#3252DF] to-[#4466ff]" />
              <h2 className="text-3xl font-bold text-gray-900">
                Hospitals Offering {treatment?.treatment_name || "This Treatment"}
              </h2>
            </motion.div>
            <p className="text-gray-600 max-w-2xl">
              Compare accredited partner hospitals and book your consultation
              with experienced healthcare professionals.
            </p>
          </div>

          {availableHospitals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-[#3252DF] font-semibold">
                  {availableHospitals.length} {availableHospitals.length === 1 ? "Hospital" : "Hospitals"}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Search and Sort Bar */}
        {availableHospitals.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-4 mb-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#3252DF]" />
                  <span className="text-gray-700">Accredited</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#3252DF]" />
                  <span className="text-gray-700">Advanced Facilities</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#3252DF]" />
                  <span className="text-gray-700">Multiple Locations</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center flex-wrap gap-4">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search hospitals..."
                    className="w-64 pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3252DF]/20"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  {search && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => setSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#3252DF]" />
                    <span>Sort by: </span>
                    <span className="font-medium">{sortBy}</span>
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>

                  <AnimatePresence>
                    {showSortMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-10"
                      >
                        {SORT_OPTIONS.map((option) => (
                          <motion.button
                            key={option}
                            whileHover={{ x: 5, backgroundColor: "#f3f4f6" }}
                            onClick={() => {
                              setSortBy(option);
                              setShowSortMenu(false);
                            }}
                            className={`w-full px-4 py-2 text-left hover:text-[#3252DF] ${
                              sortBy === option ? "text-[#3252DF] font-medium" : "text-gray-700"
                            }`}
                          >
                            {option}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Hospital Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
      >
        {visibleHospitals.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-blue-50 rounded-xl shadow-sm border border-blue-100">
            <Building2 className="w-16 h-16 text-[#3252DF] mb-6" />
            <h3 className="text-2xl font-semibold text-[#3252DF] mb-2">
              No Hospitals Found
            </h3>
            <p className="text-gray-600 max-w-md">
              {search
                ? `No partner hospital matches "${search}".`
                : "Currently, there are no hospitals offering this treatment. We are working to add more partners soon. Please contact us and we'll help you find the right option."}
            </p>
            <button
              onClick={() => (search ? setSearch("") : navigate("/contact"))}
              className="mt-4 text-[#3252DF] font-medium hover:underline"
            >
              {search ? "Clear search" : "Contact us"}
            </button>
          </div>
        ) : (
          visibleHospitals.map((hospital, index) => (
            <HospitalCard
              key={hospital?._id || index}
              hospital={hospital}
              index={index}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              ctaLabel="Book Consult"
              onCtaClick={handleBook}
            />
          ))
        )}
      </motion.div>
    </div>
  );
};

export default MedicalCardCenter;
