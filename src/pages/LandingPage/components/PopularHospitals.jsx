import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Users, Phone, ArrowRight, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSkelton from '@/components/LoadingSkelton';

// const hospitals = [
//   {
//     img: "/assets/hospital1.png",
//     name: "Fortis Memorial",
//     location: "Gurgaon, India",
//     rating: 4.9,
//     specialties: ["Cardiology", "Oncology"],
//     patients: "10k+",
//   },
//   {
//     img: "/assets/hospital2.png",
//     name: "Apollo Hospital",
//     location: "New Delhi, India",
//     rating: 4.8,
//     specialties: ["Neurology", "Orthopedics"],
//     patients: "15k+",
//   },
//   {
//     img: "/assets/hospital3.png",
//     name: "Max Healthcare",
//     location: "Bengaluru, India",
//     rating: 4.7,
//     specialties: ["Pediatrics", "Surgery"],
//     patients: "12k+",
//   },
//   {
//     img: "/assets/hospital4.png",
//     name: "Bangkok Hospital",
//     location: "Bangkok, Thailand",
//     rating: 4.9,
//     specialties: ["Cardiology", "Dental"],
//     patients: "20k+",
//   },
//   {
//     img: "/assets/hospital5.png",
//     name: "Shangri-La Medical",
//     location: "Colombo, Sri Lanka",
//     rating: 4.6,
//     specialties: ["Oncology", "Neurology"],
//     patients: "8k+",
//   },
//   {
//     img: "/assets/hospital6.png",
//     name: "Top View Medical Center",
//     location: "Hikkaduwe, Sri Lanka",
//     rating: 4.7,
//     specialties: ["Orthopedics", "Rehabilitation"],
//     patients: "5k+",
//   }
// ];

const PopularHospitals = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleClickContactNow = () => {
       navigate('/hospitals');
       
  }

    useEffect(() => {
      const fetchHospitals = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/hospitals`, {
            withCredentials: true,
          });
          setHospitals([...res?.data]);
          console.log("Hospitals are:", res?.data);
        } catch (error) {
          console.error("Error fetching treatments:", error);
        } finally {
            setLoading(false);
        }
      };
    
      fetchHospitals();
    }, []);

  return (
    <div className="relative bg-gradient-to-b from-[#ECF1FF] to-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20 -top-20 -left-20 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 -bottom-20 -right-20 animate-pulse" />
      </div>

      <div className="relative px-6 md:px-16 lg:px-40 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-poppins font-bold text-5xl max-lg:text-4xl max-md:text-3xl text-[#283841]">
            Popular{" "}
            <span className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">
              Hospitals
            </span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Discover world-class healthcare facilities with cutting-edge technology and expert medical professionals
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
         {
          loading ? (
             <LoadingSkelton length={6}/>
          ) : (
            hospitals && hospitals?.slice(0,6).map((hospital, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  // src={hospital?.img}
                  src="https://media.istockphoto.com/id/1312706413/photo/modern-hospital-building.jpg?s=2048x2048&w=is&k=20&c=15TsJBPquZtgf8ciMtV6wlEAccnI5RJoNcqzFY9qe80="
                  alt={hospital?.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{hospital?.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-poppins font-semibold text-xl text-[#152C5B] mb-2">
                  {hospital?.hospital_name}
                </h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-[#3252DF]" />
                  <p className="text-gray-600 text-sm">{hospital?.address}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {hospital?.specialties?.slice(0,3)?.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{hospital?.stats?.patients}</span>
                  </div>
                  
                  <button className="flex items-center gap-1 text-[#3252DF] text-sm font-medium group-hover:gap-2 transition-all duration-300" onClick={()=>{navigate('/hospitals')}}>
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Hover overlay */}
              <motion.div
                initial={false}
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  y: hoveredIndex === index ? 0 : 20
                }}
                className="absolute inset-0 bg-gradient-to-t from-[#3252DF]/90 to-[#4466ff]/90 flex items-center justify-center opacity-0 transition-opacity duration-300 max-sm:hidden"
              >
                <div className="text-white text-center p-6">
                  <Building2 className="w-12 h-12 mx-auto mb-4" />
                  <h4 className="font-semibold text-xl mb-2">Book Appointment</h4>
                  <p className="text-sm mb-4">Schedule a consultation with our specialists</p>
                  <button className="bg-white text-[#3252DF] px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors duration-300" onClick={handleClickContactNow}>
                    Contact Now
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

export default PopularHospitals;