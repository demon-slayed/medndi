import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Search,
  Building2,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  X,
} from "lucide-react";
import HospitalCard from "@/components/HospitalCard";
import Layout from "@/components/Layout/Layout";
import axios from "axios";
import LoadingSkelton from "@/components/LoadingSkelton";

const SORT_OPTIONS = [
  "Recommended",
  "Price: Low to High",
  "Price: High to Low",
  "Rating",
];

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

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Recommended");
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true); // start loading
        setError(false);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/hospitals`
        );
        setHospitals(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        setError(true);
      } finally {
        setLoading(false); // stop loading after fetch attempt
      }
    };

    fetchHospitals();
  }, []);

  const visibleHospitals = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? hospitals.filter((h) =>
          [h?.hospital_name, h?.address, h?.accreditation, ...(h?.specialties ?? [])]
            .filter(Boolean)
            .some((field) => String(field).toLowerCase().includes(q))
        )
      : hospitals;
    return sortHospitals(filtered, sortBy);
  }, [hospitals, search, sortBy]);

  return (
    <Layout>
      <div className="px-6 md:px-16 p-10 lg:px-24 bg-gradient-to-b from-white to-blue-50 mt-24">
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
                  Available Hospitals
                </h2>
              </motion.div>
              <p className="text-gray-600 max-w-2xl">
                Explore our network of accredited hospitals offering
                world-class medical treatments with experienced healthcare
                professionals.
              </p>
            </div>

            {!loading && hospitals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="text-[#3252DF] font-semibold">
                    {hospitals.length} {hospitals.length === 1 ? "Hospital" : "Hospitals"}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Search and Sort Bar */}
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
                    placeholder="Search hospitals, cities, specialties..."
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
        </div>

        {/* Hospital Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {loading ? (
            <LoadingSkelton length={6} />
          ) : visibleHospitals.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-sm">
              <Building2 className="w-12 h-12 text-[#3252DF] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {error ? "Couldn't load hospitals" : "No hospitals found"}
              </h3>
              <p className="text-gray-600">
                {error
                  ? "Please check your connection and try again."
                  : search
                  ? "Try a different search term."
                  : "Hospitals will appear here once they are added."}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 text-[#3252DF] font-medium hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            visibleHospitals.map((hospital, index) => (
              <HospitalCard
                key={hospital?._id || index}
                hospital={hospital}
                index={index}
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
              />
            ))
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Hospitals;
