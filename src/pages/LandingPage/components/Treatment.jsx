import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Star, Clock, Users, Building2, BadgeCheck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import LoadingSkelton from '@/components/LoadingSkelton';

// Animation Variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Extended treatments data with chemotherapy and related treatments
// const allTreatments = [
//   {
//     title: 'Advanced Chemotherapy',
//     image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop',
//     rating: 4.9,
//     duration: 'Customized',
//     patients: '5k+',
//     description: 'Latest chemotherapy protocols with personalized care',
//     tags: ['chemotherapy', 'cancer', 'oncology'],
//     hospital: 'Memorial Cancer Center',
//     success_rate: '85%'
//   },
//   {
//     title: 'Radiation Therapy',
//     image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop',
//     rating: 4.8,
//     duration: '4-6 weeks',
//     patients: '3.2k+',
//     description: 'Precision radiation treatment for various cancers',
//     tags: ['radiation', 'cancer', 'oncology'],
//     hospital: 'City Cancer Institute',
//     success_rate: '82%'
//   },
//   {
//     title: 'Immunotherapy',
//     image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop',
//     rating: 4.9,
//     duration: 'Varies',
//     patients: '2.8k+',
//     description: 'Advanced immune system therapy for cancer treatment',
//     tags: ['immunotherapy', 'cancer', 'oncology'],
//     hospital: 'Advanced Cancer Care',
//     success_rate: '78%'
//   },
//   {
//     title: 'Targeted Therapy',
//     image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop',
//     rating: 4.7,
//     duration: 'Ongoing',
//     patients: '1.5k+',
//     description: 'Precision medicine targeting specific cancer cells',
//     tags: ['targeted', 'cancer', 'chemotherapy'],
//     hospital: 'Precision Oncology Center',
//     success_rate: '80%'
//   },
//   {
//     title: 'Stem Cell Therapy',
//     image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop',
//     rating: 4.8,
//     duration: '2-3 months',
//     patients: '1k+',
//     description: 'Revolutionary stem cell treatments for blood cancers',
//     tags: ['stem cell', 'cancer', 'leukemia'],
//     hospital: 'Stem Cell Research Center',
//     success_rate: '75%'
//   }
// ];

// Quick Search Component with filtering
const QuickSearch = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const navigate = useNavigate();

  const suggestions = [
    "Chemotherapy",
    "Radiation Therapy",
    "Immunotherapy",
    "Targeted Therapy",
    "Cancer Treatment"
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    onSearch(searchQuery);
    setShowSuggestions(false);
    navigate('/treatments')
    window.scrollTo(0,0);
  };



  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl mx-auto mb-12">
      <div className="bg-white rounded-2xl shadow-xl p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search for treatments..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3252DF]/20"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            
            {/* Search Suggestions */}
            <AnimatePresence>
              {showSuggestions && searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-10"
                >
                  {suggestions
                    .filter(sugg => sugg.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((suggestion, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ backgroundColor: '#f3f4f6' }}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setShowSuggestions(false);
                          onSearch(suggestion);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button
            onClick={handleSearch}
            className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            Search <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Tags */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t max-sm:flex-wrap">
          <span className="text-sm text-gray-500">Popular:</span>
          {["Chemotherapy", "Radiation", "Immunotherapy"].map((tag, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchQuery(tag);
                onSearch(tag);
              }}
              className="px-3 py-1 bg-blue-50 rounded-full text-sm text-[#3252DF] hover:bg-blue-100 transition-colors "
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Treatment Card Component
const TreatmentCard = ({ treatment }) => {
  const navigate = useNavigate();
  
  const handleClickLearnMore = ()=>{
       navigate('/treatments')
       window.scrollTo(0,0);
  }

  return(
    <motion.div 
    variants={itemVariants} 
    whileHover={{ y: -10 }} 
    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
  >
    {/* Image */}
    <div className="relative h-48 overflow-hidden">
      <motion.img 
        // src={treatment?.image}
        src="https://media.istockphoto.com/id/1346675635/photo/modern-medical-research-laboratory-portrait-of-latin-and-black-young-scientists-using.webp?a=1&b=1&s=612x612&w=0&k=20&c=JJTcIoE9b8Bw9Mwsrf-x7E4POnQgOJqlw_4R6LnBdDI=" 
        alt={treatment?.treatment_name} 
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
      />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-500" />
        <span className="text-sm font-medium">{treatment?.rating}</span>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
    </div>

    {/* Content */}
    <div className="p-6">
      <h3 className="font-poppins font-semibold text-xl text-[#152C5B] mb-2">{treatment?.treatment_name}</h3>
      
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="w-4 h-4 text-[#3252DF]" />
        <span className="text-sm text-gray-600">{treatment?.location}</span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{treatment?.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <Clock className="w-4 h-4 text-blue-500 mx-auto mb-1" />
          <span className="text-sm text-gray-600 block">{treatment?.duration}</span>
        </div>
        <div className="bg-green-50 rounded-lg p-2 text-center">
          <BadgeCheck className="w-4 h-4 text-green-500 mx-auto mb-1" />
          <span className="text-sm text-gray-600 block">Success: {treatment?.success_rate}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-[#3252DF]" />
          <span className="text-sm text-gray-600">{treatment?.patients} patients</span>
        </div>
        <button className="flex items-center gap-2 text-[#3252DF] font-medium group-hover:gap-3 transition-all duration-300" onClick={handleClickLearnMore}>
          Learn more <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </motion.div>
  )
  
};

// Main Treatment Component
const Treatment = () => {
  const [ treatments, setTreatments ] = useState([])
  const [filteredTreatments, setFilteredTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setLoading(true); // start loading
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/treatments`, {
          withCredentials: true,
        });
        setTreatments([...res?.data]);
        setFilteredTreatments([...res?.data?.slice(0, 3)]);
        console.log("treatments are:", res?.data);
      } catch (error) {
        console.error("Error fetching treatments:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTreatments();
  }, []);

  const handleSearch = (query) => {
    const filtered = treatments.filter(treatment => 
      treatment?.treatment_name?.toLowerCase().includes(query.toLowerCase()) ||
      treatment?.description?.toLowerCase().includes(query.toLowerCase()) ||
      treatment?.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredTreatments(filtered);
  };

  return (
    <div className="relative bg-gradient-to-b from-white to-[#ECF1FF] overflow-hidden px-6 md:px-16 lg:px-40 py-20 max-sm:py-14">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full filter blur-3xl opacity-10 -top-20 -right-20"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full filter blur-3xl opacity-10 -bottom-20 -left-20"
        />
      </div>

      <motion.div 
        // initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }} 
        className="relative flex flex-col gap-16"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="font-poppins font-bold text-5xl max-lg:text-4xl max-md:text-3xl">
            Available <span className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">Treatments</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Discover advanced cancer treatments performed by leading oncologists
          </p>
        </motion.div>

        <QuickSearch onSearch={handleSearch} />

        {/* Treatment Cards */}
        <AnimatePresence mode="wait">
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
          {
            loading ? ( 
              <LoadingSkelton length={3}/>
            ) : ( 
             filteredTreatments &&  filteredTreatments?.map((treatment, index) => (
              <TreatmentCard key={index} treatment={treatment} />
            ))   
            )
          }
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Treatment;