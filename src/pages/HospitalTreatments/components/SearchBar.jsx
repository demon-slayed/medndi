import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Filter, ChevronDown, Stethoscope, 
  Heart, ArrowRight, Clock, Shield, Star, Home, ChevronRight
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const SearchBar = ( {setSearchTreatment, searchTreatment} ) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    location: "",
    specialty: "",
    priceRange: "all"
  });

  const quickFilters = [
    { label: "JCI Accredited", icon: Shield },
    { label: "Insurance Accepted", icon: Star },
    { label: "Online Consult", icon: Clock }
  ];

const handleTreatmentSearch = (e) => {
    setSearchTreatment(e.target.value);
    console.log((searchTreatment));
    
}

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-sm">
        <motion.div whileHover={{ x: 2 }} className="flex items-center gap-1 text-[#3252DF] cursor-pointer">
          <Home className="w-4 h-4" />
          <span>Home</span>
        </motion.div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <motion.span whileHover={{ x: 2 }} className="text-[#3252DF] cursor-pointer">Treatments</motion.span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">Search</span>
      </div>

      {/* Search Section */}
      <div className="bg-gradient-to-r from-[#3252DF]/5 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Title Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Available Medical Treatments
              </h1>
              <p className="text-gray-500 text-sm mt-1">Find the best treatment options worldwide</p>
            </div>
            <Button className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white gap-2">
              <Heart className="w-4 h-4" />
              Saved Treatments
            </Button>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-4"
          >
            <div className="flex flex-wrap items-center gap-4">
              {/* Search Input */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search treatments..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3252DF]/20"
                    onChange={(e) => handleTreatmentSearch(e)}
                    value = {searchTreatment}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Location Dropdown */}
              <div className="w-48">
                <Select>
                  <SelectTrigger className="border-gray-200">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Mumbai", "Delhi", "Bangalore", "Chennai"].map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 text-[#3252DF]" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* Search Button */}
              <Button className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white px-6">
                Search
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t">
              <span className="text-sm text-gray-500">Quick Filters:</span>
              <div className="flex flex-wrap gap-3">
                {quickFilters.map((filter, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-sm text-[#3252DF]"
                  >
                    <filter.icon className="w-4 h-4" />
                    {filter.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;