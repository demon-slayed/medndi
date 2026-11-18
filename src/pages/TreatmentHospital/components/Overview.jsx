import React, { useContext, useState } from "react";
import { TreatmentInfoContext } from "@/context/TreatmentInfo";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown as ChevronDown } from "react-icons/io";
import { FaMapPin as MapPin, FaClock as Clock, FaUsers as Users, FaInfo as Info } from "react-icons/fa";

const Overview = () => {
  const { treatment } = useContext(TreatmentInfoContext) || {};
  const [selectedOption, setSelectedOption] = useState("Sort by Recommended");
  const [isOpen, setIsOpen] = useState(false);

  const locations = [
    { icon: MapPin, label: "Near Park", value: "4.5" },
    { icon: Clock, label: "Near nightlife", value: "24/7" },
    { icon: Users, label: "Near theater", value: "500+" },
    { icon: Info, label: "Near Hotel", value: "Info" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 md:px-10 lg:px-20 py-12 bg-white"
    >
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-[#112211]"
      >
        Overview
      </motion.h2>

      {treatment?.desc && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-700 leading-relaxed mb-8"
        >
          {treatment.desc}
        </motion.p>
      )}

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12"
      >
        {/* Rating Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-xl p-6"
        >
          <h3 className="text-4xl font-bold mb-4">4.2</h3>
          <p className="font-bold">Very good</p>
          <p className="text-sm opacity-90">371 reviews</p>
        </motion.div>

        {/* Location Cards */}
        {locations.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white border border-[#3252DF] rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <item.icon className="w-8 h-8 text-[#3252DF] mb-4" />
            <p className="font-bold">{item.value}</p>
            <p className="text-gray-600">{item.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Sort Section */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-[#112211]">
          Treatments Available
        </h3>

        <div className="relative">
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#3252DF] rounded-lg hover:bg-blue-50 transition-colors"
          >
            <span>{selectedOption}</span>
            <ChevronDown className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 border border-gray-100"
              >
                {["Price: Low to High", "Price: High to Low", "Category", "Sort by Recommended"].map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    onClick={() => {
                      setSelectedOption(option);
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    {option}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Overview;
