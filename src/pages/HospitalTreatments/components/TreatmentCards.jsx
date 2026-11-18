import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Phone, Home, Stethoscope } from 'lucide-react';
import { BreadcrumbItem } from '@/pages/TreatmentHospital/components/TreatmentIfo';
import SearchCard from '@/components/SearchCard';
import axios from 'axios';
import useAppStore from '@/store/useAppStore';
import LoadingSkelton from '@/components/LoadingSkelton';
import TreatmentCard from '@/pages/SearchResults/Components/TreatmentCard';
import { matchesTreatmentQuery } from '@/pages/SearchResults/Components/treatmentSearch';

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
  const [hospital, setLocalHospital] = useState(null);
  const [searchTreatment, setSearchTreatment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // null | "notfound" | "failed"
  const { setTreatment, setHospital } = useAppStore();
  const { hospital_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setLocalHospital(null);
        setTreatments([]);
        const base = import.meta.env.VITE_BASE_URL;
        const [hospitalRes, treatmentsRes] = await Promise.all([
          axios.get(`${base}/hospitals/${hospital_id}`),
          axios.get(`${base}/treatments/hospital/${hospital_id}`),
        ]);
        if (cancelled) return;
        setLocalHospital(hospitalRes?.data ?? null);
        setTreatments(Array.isArray(treatmentsRes?.data) ? treatmentsRes.data : []);
      } catch (err) {
        console.error("Error fetching hospital treatments:", err);
        if (!cancelled) setError(err?.response?.status === 404 ? "notfound" : "failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [hospital_id]);

  const visibleTreatments = useMemo(
    () => treatments.filter((t) => matchesTreatmentQuery(t, searchTreatment)),
    [treatments, searchTreatment]
  );

  const openTreatment = (treatment) => {
    navigate(`/treatment-details/${treatment?.treatment_id}`);
  };

  // Booking reads the selected treatment + hospital from the store
  const bookTreatment = (treatment) => {
    setTreatment(treatment);
    setHospital(hospital);
    navigate('/booking');
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
            <BreadcrumbItem><Link to="/hospitals">Hospitals</Link></BreadcrumbItem>
            {hospital?.hospital_name && (
              <BreadcrumbItem>
                <Link to={`/hospital-details/${hospital_id}`}>{hospital.hospital_name}</Link>
              </BreadcrumbItem>
            )}
            <BreadcrumbItem isLast>Treatments</BreadcrumbItem>
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

  const renderEmpty = () => {
    let title = "No treatments found";
    let message = "This hospital hasn't listed any treatments yet.";
    if (error === "notfound") {
      title = "Hospital not found";
      message = "We couldn't find this hospital. It may have been removed or the link is incorrect.";
    } else if (error) {
      title = "Couldn't load treatments";
      message = "Please check your connection and try again.";
    } else if (searchTreatment) {
      message = `Nothing matches "${searchTreatment}" at this hospital.`;
    }
    return (
      <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-sm">
        <Stethoscope className="w-12 h-12 text-[#3252DF] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{message}</p>
        {searchTreatment && !error ? (
          <button onClick={() => setSearchTreatment("")} className="mt-4 text-[#3252DF] font-medium hover:underline">
            Show all treatments
          </button>
        ) : (
          <button onClick={() => navigate(error === "notfound" ? "/hospitals" : "/treatments")} className="mt-4 text-[#3252DF] font-medium hover:underline">
            {error === "notfound" ? "Browse all hospitals" : "Browse all treatments"}
          </button>
        )}
      </div>
    );
  };

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
            Available Treatments{hospital?.hospital_name ? " at " : ""}
            {hospital?.hospital_name && (
              <span className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">
                {hospital.hospital_name}
              </span>
            )}
          </h2>
          <p className="mt-4 text-gray-600 max-w-[80%] mx-auto max-sm:text-sm">
            Choose a treatment to view details or book your consultation
          </p>
        </motion.div>

        <SearchCard
          value={searchTreatment}
          onChange={setSearchTreatment}
          onClear={() => setSearchTreatment("")}
          title="Treatments at this hospital"
          subtitle={hospital?.address || "Find the right treatment for you"}
          placeholder="Search treatments..."
          resultCount={loading || error ? undefined : visibleTreatments.length}
        />

        <motion.div
          variants={containerVariants}
          initial="visible"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
         {
            loading ? (
              <LoadingSkelton length={3}/>
            ) : error || visibleTreatments.length === 0 ? (
              renderEmpty()
            ) : (
              visibleTreatments.map((treatment, index) => (
                <TreatmentCard
                  key={treatment?._id || index}
                  treatment={treatment}
                  index={index}
                  hovered={hoveredIndex === index}
                  onHoverChange={setHoveredIndex}
                  onOpen={openTreatment}
                  ctaLabel="Book Now"
                  onCtaClick={bookTreatment}
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
