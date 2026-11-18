import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, Home, Stethoscope } from 'lucide-react';
import { BreadcrumbItem } from '@/pages/TreatmentHospital/components/TreatmentIfo';
import SearchCard from '@/components/SearchCard';
import axios from 'axios';
import LoadingSkelton from '@/components/LoadingSkelton';
import TreatmentCard from './TreatmentCard';
import { matchesTreatmentQuery } from './treatmentSearch';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const TreatmentCards = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [searchText, setSearchText] = useState(query);
  const navigate = useNavigate();

  // Keep the input in sync when the URL query changes (header/footer links, back button)
  useEffect(() => {
    setSearchText(query);
  }, [query]);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setLoading(true); // start loading
        setError(false);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/treatments`);
        setTreatments(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching treatments:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  const visibleTreatments = useMemo(
    () => treatments.filter((t) => matchesTreatmentQuery(t, searchText)),
    [treatments, searchText]
  );

  const applySearch = (text) => {
    const q = text.trim();
    setSearchParams(q ? { q } : {}, { replace: true });
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchParams({}, { replace: true });
  };

  const openTreatment = (treatment) => {
    navigate(`/treatment-details/${treatment?.treatment_id}`);
  };

  const PageBreadcrumb = () => (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 max-sm:mt-3"
    >
      <div className="max-w-7xl mx-auto px-8 max-sm:px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 max-sm:gap-0 flex-wrap text-sm">
            <BreadcrumbItem><Home className="w-4 h-4" onClick={()=>{navigate('/')}}/></BreadcrumbItem>
            <BreadcrumbItem isLast>Medical Treatments</BreadcrumbItem>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={()=>{navigate('/contact')}}
              className="flex items-center gap-2 px-4 py-2 bg-[#3252DF]/10 rounded-lg text-[#3252DF]"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm max-sm:text-xs font-medium">Get Expert Help</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );

  return (
    <div className="relative bg-gradient-to-b from-[#ECF1FF] to-white overflow-hidden min-h-screen">
      <PageBreadcrumb/>
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full filter blur-3xl opacity-20 -top-20 -left-20"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full filter blur-3xl opacity-20 -bottom-20 -right-20"
        />
      </div>

      <div className="relative px-6 md:px-16 lg:px-40 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-poppins font-bold text-5xl max-lg:text-4xl max-md:text-3xl max-sm:text-[26px] text-[#283841]">
            Available{" "}
            <span className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">
              Treatments at Arogini
            </span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-[80%] mx-auto max-sm:text-sm">
            Discover world-class medical treatments with cutting-edge technology and expert healthcare professionals across India
          </p>
        </motion.div>

        <SearchCard
          value={searchText}
          onChange={setSearchText}
          onSubmit={applySearch}
          onClear={clearSearch}
          subtitle={query ? `Showing results for "${query}"` : "Find the best treatment options worldwide"}
          resultCount={loading ? undefined : visibleTreatments.length}
        />

        <motion.div
          variants={containerVariants}
          initial="visible"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
        {
          loading ? (
            <LoadingSkelton length={6}/>
          ) : visibleTreatments.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-sm">
              <Stethoscope className="w-12 h-12 text-[#3252DF] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {error ? "Couldn't load treatments" : "No treatments found"}
              </h3>
              <p className="text-gray-600">
                {error
                  ? "Please check your connection and try again."
                  : searchText
                  ? `Nothing matches "${searchText}". Try another treatment, specialty or city.`
                  : "Treatments will appear here once they are added."}
              </p>
              {searchText && (
                <button onClick={clearSearch} className="mt-4 text-[#3252DF] font-medium hover:underline">
                  Show all treatments
                </button>
              )}
            </div>
          ) : (
            visibleTreatments.map((treatment, index) => (
              <TreatmentCard
                key={treatment?._id || index}
                treatment={treatment}
                index={index}
                hovered={hoveredIndex === index}
                onHoverChange={setHoveredIndex}
                onOpen={openTreatment}
                ctaLabel="Choose Hospital"
                onCtaClick={openTreatment}
                variants={itemVariants}
              />
            ))
          )
        }
        </motion.div>
      </div>
    </div>
  );
};

export default TreatmentCards;
