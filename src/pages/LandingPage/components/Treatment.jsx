import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Star, Clock, Building2, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import LoadingSkelton from '@/components/LoadingSkelton';

const FALLBACK_TREATMENT_IMAGE =
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop";

// Animation Variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Quick Search Component: sends the user to /treatments?q=<query>
const QuickSearch = ({ suggestions = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const goToResults = (query) => {
    const q = query.trim();
    if (!q) return;
    setShowSuggestions(false);
    navigate(`/treatments?q=${encodeURIComponent(q)}`);
    window.scrollTo(0,0);
  };

  const matchingSuggestions = suggestions
    .filter(sugg => sugg.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 6);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-4">
        <form
          className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            goToResults(searchQuery);
          }}
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search treatments, e.g. knee replacement"
              aria-label="Search treatments"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3252DF]/20"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            {/* Search Suggestions */}
            <AnimatePresence>
              {showSuggestions && searchQuery && matchingSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-10"
                >
                  {matchingSuggestions.map((suggestion, idx) => (
                    <motion.button
                      key={idx}
                      type="button"
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        goToResults(suggestion);
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
            type="submit"
            variant="brand"
            size="xl"
          >
            Search <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Quick Tags */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 pt-4 border-t">
            <span className="text-sm text-gray-500">Popular:</span>
            {suggestions.slice(0, 3).map((tag, idx) => (
              <motion.button
                key={idx}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToResults(tag)}
                className="px-3 py-1 bg-blue-50 rounded-full text-sm text-[#3252DF] hover:bg-blue-100 transition-colors "
              >
                {tag}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Enhanced Treatment Card Component
const TreatmentCard = ({ treatment }) => {
  const navigate = useNavigate();

  const handleClickLearnMore = ()=>{
       navigate(`/treatment-details/${treatment?.treatment_id}`)
       window.scrollTo(0,0);
  }

  return(
    <motion.div
    variants={itemVariants}
    whileHover={{ y: -10 }}
    className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
  >
    {/* Image */}
    <div className="relative h-48 overflow-hidden">
      <motion.img
        src={treatment?.image || FALLBACK_TREATMENT_IMAGE}
        onError={(e) => { e.currentTarget.src = FALLBACK_TREATMENT_IMAGE; }}
        alt={treatment?.treatment_name}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
      />
      {treatment?.rating != null && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium">{treatment.rating}</span>
        </div>
      )}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
    </div>

    {/* Content */}
    <div className="p-5 sm:p-6 flex flex-col flex-1">
      {treatment?.category && (
        <span className="self-start mb-2 text-xs px-3 py-1 rounded-full bg-blue-50 text-[#3252DF] font-medium">{treatment.category}</span>
      )}
      <h3 className="font-poppins font-semibold text-xl text-[#152C5B] mb-2">{treatment?.treatment_name}</h3>

      {treatment?.location && (
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-4 h-4 text-[#3252DF]" />
          <span className="text-sm text-gray-600">{treatment.location}</span>
        </div>
      )}

      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{treatment?.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <Clock className="w-4 h-4 text-blue-500 mx-auto mb-1" />
          <span className="text-sm text-gray-600 block">{treatment?.duration || "Varies"}</span>
        </div>
        <div className="bg-green-50 rounded-lg p-2 text-center">
          <BadgeCheck className="w-4 h-4 text-green-500 mx-auto mb-1" />
          <span className="text-sm text-gray-600 block">Success: {treatment?.success_rate || "N/A"}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
        <div>
          {treatment?.estimated_cost?.min ? (
            <>
              <p className="text-xs text-gray-500">From</p>
              <p className="font-bold text-[#3252DF]">₹{Number(treatment.estimated_cost.min).toLocaleString("en-IN")}</p>
            </>
          ) : (
            <p className="text-sm text-gray-500">Cost on request</p>
          )}
        </div>
        <button
          type="button"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
          onClick={handleClickLearnMore}
        >
          View details <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </motion.div>
  )

};

// Main Treatment Component
const Treatment = () => {
  const [ treatments, setTreatments ] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setLoading(true); // start loading
        setError(false);
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/treatments`, {
          withCredentials: true,
        });
        setTreatments(Array.isArray(res?.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching treatments:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  const suggestions = treatments.map((t) => t?.treatment_name).filter(Boolean);
  const featuredTreatments = treatments.slice(0, 3);

  return (
    <section className="relative bg-gradient-to-b from-white to-[#ECF1FF] overflow-hidden py-16 lg:py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
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
        whileInView="visible"
        viewport={{ once: true }}
        className="relative max-w-7xl mx-auto px-6 flex flex-col gap-12"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-[#283841]">
            Popular <span className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">Treatments</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Search a procedure or browse popular treatments, with indicative costs from partner hospitals
          </p>
        </motion.div>

        <QuickSearch suggestions={suggestions} />

        {/* Treatment Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
          {
            loading ? (
              <LoadingSkelton length={3}/>
            ) : featuredTreatments.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-sm text-gray-600">
                {error
                  ? "We couldn't load treatments right now. Please try again later."
                  : "No treatments available yet."}
              </div>
            ) : (
              featuredTreatments.map((treatment, index) => (
                <TreatmentCard key={treatment?._id || index} treatment={treatment} />
              ))
            )
          }
          </motion.div>
        </AnimatePresence>

        {!loading && treatments.length > featuredTreatments.length && (
          <div className="text-center -mt-6">
            <Link
              to="/treatments"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border-2 border-[#3252DF] text-[#3252DF] font-medium hover:bg-blue-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40"
            >
              View all {treatments.length} treatments
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default Treatment;
