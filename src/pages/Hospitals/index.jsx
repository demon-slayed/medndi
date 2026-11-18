import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MapPin,
  Star,
  Check,
  ArrowRight,
  Activity,
  Stethoscope,
  Clock,
  Users,
  Award,
  Microscope,
  ThumbsUp,
  SlidersHorizontal,
  Search,
  Filter,
  Building2,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import HospitalCard from "@/components/HospitalCard";
import Layout from "@/components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSkelton from "@/components/LoadingSkelton";

const MedicalCardCenter = () => {
  const [hospitals, setHospitals] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recommended");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true); // start loading
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/hospitals`
        );
        setHospitals([...response.data]); // store hospitals
        console.log("hospitals are: ", response.data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      } finally {
        setLoading(false); // stop loading after fetch attempt
      }
    };

    fetchHospitals();
  }, []);

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
                Explore our network of JCI-accredited hospitals offering
                world-class medical treatments with experienced healthcare
                professionals.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-[#3252DF] font-semibold">
                  15+ Hospitals
                </span>
              </div>
            </motion.div>
          </div>

          {/* Filters and Sort Bar */}
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
                  <span className="text-gray-700">JCI Accredited</span>
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
                    placeholder="Search hospitals..."
                    className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3252DF]/20"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                        {[
                          "Recommended",
                          "Price: Low to High",
                          "Price: High to Low",
                          "Rating",
                          "Experience",
                        ].map((option) => (
                          <motion.button
                            key={option}
                            whileHover={{ x: 5, backgroundColor: "#f3f4f6" }}
                            onClick={() => {
                              setSortBy(option.toLowerCase());
                              setShowSortMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:text-[#3252DF]"
                          >
                            {option}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Filter Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#3252DF] text-white rounded-lg hover:shadow-md"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Active Filters */}
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#3252DF] rounded-full text-sm"
            >
              <span>JCI Accredited</span>
              <button className="hover:text-blue-700">×</button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#3252DF] rounded-full text-sm"
            >
              <span>Multi-Specialty</span>
              <button className="hover:text-blue-700">×</button>
            </motion.div>
          </div>
        </div>

        {/* Hospital Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {loading ? (
            <LoadingSkelton length={12} />
          ) : (
            hospitals && hospitals?.map((hospital, index) => (
              <HospitalCard
                key={index}
                hospital={hospital}
                index={index}
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
              />
            ))
          )}

          {/* Your existing hospital card mapping code here */}
        </motion.div>
      </div>
    </Layout>
  );
};

export default MedicalCardCenter;
