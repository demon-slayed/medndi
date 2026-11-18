import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSkelton from '@/components/LoadingSkelton';

const FALLBACK_HOSPITAL_IMAGE =
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80";

const PopularHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const handleClickViewDetails = (hospital) => {
       navigate(`/hospital-details/${hospital?.hospital_id}`);
  }

  // Booking needs a treatment, so send the user to this hospital's treatments first
  const handleClickBook = (hospital) => {
       navigate(`/hospital/${hospital?.hospital_id}/treatments`);
  }

    useEffect(() => {
      const fetchHospitals = async () => {
        try {
          setLoading(true);
          setError(false);
          const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/hospitals`, {
            withCredentials: true,
          });
          setHospitals(Array.isArray(res?.data) ? res.data : []);
        } catch (error) {
          console.error("Error fetching hospitals:", error);
          setError(true);
        } finally {
            setLoading(false);
        }
      };
    
      fetchHospitals();
    }, []);

  return (
    <div className="relative bg-gradient-to-b from-[#ECF1FF] to-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20 -top-20 -left-20 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 -bottom-20 -right-20 animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-[#283841]">
            Popular{" "}
            <span className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">
              Hospitals
            </span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Accredited hospitals in Delhi NCR, Bengaluru and Pune, with experienced specialists and modern facilities
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
         {
          loading ? (
             <LoadingSkelton length={6}/>
          ) : hospitals.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-sm text-gray-600">
              {error
                ? "We couldn't load hospitals right now. Please try again later."
                : "No hospitals available yet."}
            </div>
          ) : (
            hospitals.slice(0,6).map((hospital, index) => (
            <motion.div
              key={hospital?._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hospital?.hospital_image?.[0] || FALLBACK_HOSPITAL_IMAGE}
                  onError={(e) => { e.currentTarget.src = FALLBACK_HOSPITAL_IMAGE; }}
                  alt={hospital?.hospital_name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {hospital?.rating != null && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{hospital.rating}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <h3 className="font-poppins font-semibold text-xl text-[#152C5B] mb-2 line-clamp-2">
                  {hospital?.hospital_name}
                </h3>
                
                <div className="flex items-start gap-2 mb-4">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#3252DF]" />
                  <p className="text-gray-600 text-sm line-clamp-2">{hospital?.address}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4 flex-1 content-start">
                  {hospital?.specialties?.slice(0,3)?.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
                    onClick={() => handleClickViewDetails(hospital)}
                  >
                    View details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg border border-[#3252DF]/40 text-[#3252DF] text-sm font-medium hover:bg-blue-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40"
                    onClick={() => handleClickBook(hospital)}
                  >
                    View treatments
                  </button>
                </div>
              </div>

            </motion.div>
          ))
          )
         }
        </motion.div>
      </div>
    </div>
  );
};

export default PopularHospitals;