import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Mail, 
  Phone, 
  ArrowRight, 
  Activity,
  Calendar,
  Clock,
  IndianRupee,
  CheckCircle2,Home,
  Loader2
} from 'lucide-react';
import SearchBar from './SearchBar';
import { BreadcrumbItem } from '@/pages/TreatmentHospital/components/TreatmentIfo';
import SearchCard from '@/components/SearchCard';
import axios from 'axios';
import LoadingSkelton from '@/components/LoadingSkelton';


const TreatmentCards = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [ treatments, setTreatments ] = useState([]);
  const [loading, setLoading] = useState(true)
  // console.log("treatment from context is: ", treatments);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setLoading(true); // start loading
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/treatments`);
        setTreatments(response?.data);
        console.log("treatments: ", response?.data);
      } catch (error) {
        console.error("Error fetching treatments:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTreatments();
  }, []);
  
  const navigate = useNavigate();

  const handleClickCard = () => {
    navigate('/treatment-details')
  }

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
            <BreadcrumbItem>Medical Treatments</BreadcrumbItem>
            <BreadcrumbItem>Available Treatments</BreadcrumbItem>
          
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-[#3252DF]/10 rounded-lg text-[#3252DF]"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm max-sm:text-xs font-medium" onClick={()=>{navigate('/contact')}}>Get Expert Help</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );

  return (
    <div className="relative bg-gradient-to-b from-[#ECF1FF] to-white overflow-hidden min-h-screen">
      {/* Animated background elements */}
      <PageBreadcrumb/>
      <div className="absolute inset-0">
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
            Availabale{" "}
            <span className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">
              Treatments at Arogini
            </span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-[80%] mx-auto max-sm:text-sm">
            Discover world-class medical treatments with cutting-edge technology and expert healthcare professionals across India
          </p>
        </motion.div>


          <SearchCard />


        <motion.div 
          variants={containerVariants}
          whileInView="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
         {
          loading ? ( 
           <LoadingSkelton length={12}/>

          ) : (
            treatments &&  treatments?.map((treatment, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onClick={() => { navigate(`/treatment-details/${treatment?.treatment_id}`)}}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  // src={treatment?.image}
                  src="https://plus.unsplash.com/premium_photo-1664456804517-f6347600b764?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt={treatment?.treatment_name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{treatment?.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-poppins font-semibold text-xl text-[#152C5B] mb-2">
                  {treatment?.treatment_name}
                </h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-[#3252DF]" />
                  <p className="text-gray-600 text-sm">{treatment?.location}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{treatment?.estimated_cost?.min}-{treatment?.estimated_cost?.max}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Duration: {treatment?.duration}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {treatment?.features?.map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Success Rate: {treatment?.success_rate}</span>
                  </div>
                  
                  <button 
                    className="px-4 py-2 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:shadow-lg transition-shadow"
                    
                  >
                    Enquire Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Hover overlay */}
              <motion.div
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  y: hoveredIndex === index ? 0 : 20
                }}
                className="absolute inset-0 bg-gradient-to-t from-[#3252DF]/90 to-[#4466ff]/90 flex items-center justify-center opacity-0 transition-opacity duration-300 max-sm:hidden"
              >
                <div className="text-white text-center p-6">
                  <Activity className="w-12 h-12 mx-auto mb-4" />
                  <h4 className="font-semibold text-xl mb-2">Contact Specialists</h4>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      {treatment?.email}
                    </p>
                    <p className="text-sm flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      {treatment?.phone}
                    </p>
                  </div>
                  <button className="bg-white text-[#3252DF] px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors duration-300"
                  onClick={handleClickCard}
                  >
                    Schedule Consultation
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ))
          )

             
         }
        </motion.div>
      </div>
    </div>
  );
};

export default TreatmentCards;