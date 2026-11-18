import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Phone,
  Globe,
  Clock,
  Heart,
  Share2,
  CheckCircle,
  Users,
  Award,
  Building2,
  Home,
  Calendar,
  Camera,
  ThumbsUp,
  BadgeCheck,
  ChevronDown,
  Activity,
  Shield,
  Stethoscope,
  ClipboardList,
  MessageCircle,
} from "lucide-react";
import Header from "../../components/Layout/Header";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import { HospitalInfoContext } from "@/context/HospitalInfo";

// Example button component (replace with your own if needed)
export const Button = ({ children, className = "", ...props }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

/** Example breadcrumb item component **/
export const BreadcrumbItem = ({ children, isLast }) => (
  <div className="flex items-center gap-1 text-sm">
    {children}
    {!isLast && <span className="text-gray-400">/</span>}
  </div>
);

const Hospitals = () => {
  const { hospital, setHospital } = useContext(HospitalInfoContext);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showFullOverview, setShowFullOverview] = useState(false);
  const navigate = useNavigate();


  const handleBookHospitalClick = (hospital) => {
    console.log("hos:", hospital);
    
      navigate(`/hospital-details/hjhjh${hospital.name}`)
       setHospital({
         name: hospital?.name,
         address: hospital?.address,
         rating: hospital?.rating,
         reviews: hospital?.reviews,
         accreditation: hospital?.accreditation,
         stats: hospital?.stats
       })
      
  }

  // Minimal breadcrumb bar
  const PageBreadcrumb = () => (
    
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm max-md:flex-wrap">
            <BreadcrumbItem>
              <Home className="w-4 h-4" />
            </BreadcrumbItem>
            <BreadcrumbItem>Medical Treatments</BreadcrumbItem>
            <BreadcrumbItem isLast>Hospitals</BreadcrumbItem>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3252DF]/10 to-[#4466ff]/10 rounded-lg text-[#3252DF]"
            >
              <Phone className="w-4 h-4 max-sm:hidden" />
              <span className="text-sm max-sm:text-xs font-medium">Get Expert Help</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );

  return (
     <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
          {/* Replace with your real header */}
          {/* <Header /> */}
          {/* Spacing after a fixed header */}
          <div className="mt-28"></div>

          {/* Breadcrumb */}
          <PageBreadcrumb />

          {/* Main Wrapper */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Hospital Title & Stats Card */}
            {
                hospitals.map((hospital,idx)=>(
                    <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6" key={idx}>
                <div>
                  {/* Accreditation Badge */}
                  <div className="flex items-center gap-3 mb-2">
                    <BadgeCheck className="w-6 h-6 text-[#3252DF]" />
                    <span className="text-sm font-medium text-[#3252DF] bg-blue-50 px-2 py-1 rounded">
                      {hospital.accreditation}
                    </span>
                  </div>
                  <h1 className="text-3xl max-sm:text-2xl font-bold text-gray-900 mb-2">
                     {hospital.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-6 max-sm:gap-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#3252DF]" />
                      <span>{hospital.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{hospital.rating}</span>
                      <span className="text-sm">({hospital.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">Open Now</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2 rounded-lg border transition-colors ${
                      isLiked
                        ? "bg-red-50 border-red-200 text-red-500"
                        : "text-[#3252DF] border-[#3252DF]"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg border text-[#3252DF] border-[#3252DF]"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                    <Button className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white px-6"
                    onClick ={()=>{handleBookHospitalClick(hospital)}}
                    >
                      Book Hospital
                    </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl max-md:grid-cols-2">
                {hospital.stats.map(({ icon: Icon, label, value, trend }, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="text-center p-4 bg-white/80 backdrop-blur rounded-xl shadow-sm"
                  >
                    <Icon className="w-6 h-6 text-[#3252DF] mx-auto mb-2" />
                    <p className="font-bold text-xl">{value}</p>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="text-xs text-[#3252DF] mt-1">{trend}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
                ))
            }
            




            {/* Booking CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 bg-gradient-to-r from-[#3252DF] to-[#4466ff] rounded-2xl p-8 text-white"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Ready to Book Your Appointment?
                  </h3>
                  <p className="text-white/90">
                    Our medical experts are here to help you
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg text-white"
                  >
                    Contact Us
                  </motion.button>
                  <a href="/booking">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-white text-[#3252DF] rounded-xl font-medium"
                  >
                    Book Now
                  </motion.button>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
     </Layout>
  );
};

export default Hospitals;
