import React, { useState, useContext, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import axios from "axios";
import useAppStore from "@/store/useAppStore";
import toast from "react-hot-toast";

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

const HospitalDetails = () => {
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showFullOverview, setShowFullOverview] = useState(false);
  const hasShownToast = React.useRef(false);
  // const { hospital, setHospital } = useContext(HospitalInfoContext);
  // const  { treatment } = useContext(TreatmentInfoContext);
  const { hospital, setHospital, treatment } = useAppStore();
  const [ loading, setLoading ] = useState(true);
  const { hospital_id } =  useParams();
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchHospital = async () => {
      try {
        window.scrollTo(0,0)
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/hospitals/${hospital_id}`, { withCredentials: true});
        setHospital(res.data);
        console.log("hospital iss: ", hospital);
        
      } catch (err) {
        console.error("Error fetching hospital:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, [hospital_id]);

  useEffect(()=>{
    if (!hasShownToast.current) {
      toast.success("please check treatments for a particular treatment");
      hasShownToast.current = true;
    }
  },[])
  
  const handleBookAppointmentClick = () =>{
        navigate(`/hospital/${hospital_id}/treatments`)
  }

  // Hospital gallery images
  const hospitalImages = [
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop", // Main hospital building
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop", // Modern operation theater
    "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500&auto=format&fit=crop", // Hospital room
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop", // Laboratory
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop", // Reception area
  ];

  // Amenities with realistic hospital facilities
  const amenities = [
    {
      icon: Building2,
      label: "Private Rooms",
      description: "Luxurious private rooms with modern amenities",
    },
    {
      icon: Activity,
      label: "Rehabilitation Center",
      description: "State-of-the-art rehabilitation equipment",
    },
    {
      icon: Shield,
      label: "ICU Facility",
      description: "24/7 intensive care unit with expert staff",
    },
    {
      icon: Building2,
      label: "Cafeteria",
      description: "Nutritious meals with dietary considerations",
    },
    {
      icon: Clock,
      label: "Emergency Services",
      description: "Round-the-clock emergency medical care",
    },
    {
      icon: Globe,
      label: "International Desk",
      description: "Multilingual support for international patients",
    },
  ];

  // Medical specialties and certifications
  const highlights = [
    {
      title: hospital?.highlights?.[0]?.title,
      description: hospital?.highlights?.[0]?.description,
      icon: BadgeCheck,
    },
    {
      title: "Medical Tourism",
      description: "Complete assistance for international patients",
      icon: Globe,
    },
    {
      title: hospital?.highlights?.[1]?.title,
      description: hospital?.highlights?.[1]?.description,
      icon: Stethoscope,
    },
    {
      title: "Critical Care",
      description: "Advanced ICU with 24/7 monitoring",
      icon: Clock,
    },
  ];

  // Hospital statistics // in backend its name is key_highlights
  // const stats = [
  //   {
  //     icon: Users,
  //     label: "Specialists",
  //     value: "150+",
  //     trend: "+15 this year",
  //   },
  //   {
  //     icon: Building2,
  //     label: "Departments",
  //     value: "28",
  //     trend: "Full-service hospital",
  //   },
  //   {
  //     icon: Award,
  //     label: "Experience",
  //     value: "30 yrs",
  //     trend: "Since 1994",
  //   },
  //   {
  //     icon: Star,
  //     label: "Rating",
  //     value: "4.8/5",
  //     trend: "1200+ reviews",
  //   },
  // ];
  const icons = [ Users, Building2, Award, Star];

  // Expert doctors with profile images
  const doctorsList = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      experience: "15+ years",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop",
      qualifications: "MD, FACC",
      expertise: "Interventional Cardiology",
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Neurosurgery",
      experience: "12+ years",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop",
      qualifications: "MD, PhD",
      expertise: "Brain & Spine Surgery",
    },
    {
      name: "Dr. Emily Williams",
      specialty: "Oncology",
      experience: "18+ years",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&auto=format&fit=crop",
      qualifications: "MD, FASCO",
      expertise: "Medical Oncology",
    },
    {
      name: "Dr. James Martinez",
      specialty: "Orthopedics",
      experience: "20+ years",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop",
      qualifications: "MD, FAAOS",
      expertise: "Joint Replacement",
    },
  ];

  // Detailed patient reviews
  const reviews = [
    {
      user: "John Davidson",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Underwent cardiac surgery here. The facilities are world-class and the medical team was extremely professional. Dr. Johnson's expertise was evident throughout my treatment.",
      helpful: 42,
      procedure: "Cardiac Surgery",
      verified: true,
    },
    {
      user: "Sarah Mitchell",
      rating: 4,
      date: "1 month ago",
      comment:
        "Had a great experience with the neurology department. The staff was caring and attentive. Special thanks to Dr. Chen for his excellent care and clear communication.",
      helpful: 35,
      procedure: "Neurological Treatment",
      verified: true,
    },
    {
      user: "Robert Wilson",
      rating: 5,
      date: "2 months ago",
      comment:
        "The oncology department provided exceptional care. From diagnosis to treatment, every step was handled with utmost professionalism. The new chemotherapy unit is state-of-the-art.",
      helpful: 28,
      procedure: "Cancer Treatment",
      verified: true,
    },
  ];

  // Facility images for virtual tour
  const facilityImages = [
    {
      url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop",
      title: "Operation Theater",
      description: "State-of-the-art surgical suite with robotic assistance",
    },
    {
      url: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500&auto=format&fit=crop",
      title: "Private Room",
      description: "Luxurious private rooms with modern amenities",
    },
    {
      url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop",
      title: "Laboratory",
      description: "Advanced diagnostic laboratory",
    },
    {
      url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop",
      title: "Reception",
      description: "Welcoming reception area with 24/7 assistance",
    },
    {
      url: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=500&auto=format&fit=crop",
      title: "Emergency",
      description: "Fully equipped emergency department",
    },
    {
      url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&auto=format&fit=crop",
      title: "ICU",
      description: "Modern intensive care unit with advanced monitoring",
    },
  ];

  // Reusable Tab button
  const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        isActive
          ? "bg-[#3252DF] text-white shadow-lg"
          : "hover:bg-blue-50 text-gray-600"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </motion.button>
  );

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
              <Home className="w-4 h-4 cursor-pointer" onClick={()=>{navigate('/')}}/>
            </BreadcrumbItem>
            <BreadcrumbItem>Medical Treatments</BreadcrumbItem>
            <BreadcrumbItem>{ treatment?.treatment_name ? treatment?.treatment_name : "Treatment" }</BreadcrumbItem>
            <BreadcrumbItem isLast>{ hospital?.hospital_name ? hospital?.hospital_name : "Hospital"}</BreadcrumbItem>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3252DF]/10 to-[#4466ff]/10 rounded-lg text-[#3252DF]"
            >
              <Phone className="w-4 h-4 max-sm:hidden" />
              <span className="text-sm max-sm:text-xs font-medium" onClick={()=>{navigate('/contact')}}>Get Expert Help</span>
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  {/* Accreditation Badge */}
                  <div className="flex items-center gap-3 mb-2">
                    <BadgeCheck className="w-6 h-6 text-[#3252DF]" />
                    <span className="text-sm font-medium text-[#3252DF] bg-blue-50 px-2 py-1 rounded">
                       {hospital?.badges?.[0]}
                    </span>
                  </div>
                  <h1 className="text-3xl max-sm:text-2xl font-bold text-gray-900 mb-2">
                     {hospital?.hospital_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-6 max-sm:gap-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#3252DF]" />
                      <span> { hospital?.address }</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{ hospital?.rating}</span>
                      {/* <span className="text-sm">(371 reviews)</span> */}
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
                    <Button className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white px-6" onClick={()=> handleBookAppointmentClick()}>
                       Show Treatments
                    </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl max-md:grid-cols-2">
                {hospital?.key_highlights?.map(({ label, value, trend }, idx) =>{ 
                  const Icon = icons[idx % icons.length];
                  return(
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
                )})}
              </div>
            </motion.div>

            {/* Image Gallery Section */}
            {false && (
                <>
                  <div className="relative mb-8 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Main image (selected) */}
                      <motion.div
                        className="sm:col-span-2 sm:row-span-2 relative group"
                        whileHover={{ scale: 1.01 }}
                      >
                        <motion.img
                          src={hospitalImages[selectedImage]}
                          alt="Hospital"
                          className="w-full h-full max-h-[500px] object-cover rounded-2xl"
                          layoutId="main-image"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>

                      {/* Thumbnails */}
                      {hospitalImages.slice(1, 5).map((img, idx) => (
                        <motion.div
                          key={idx}
                          className="relative group"
                          whileHover={{ scale: 1.02 }}
                        >
                          <img
                            src={img}
                            alt={`View ${idx + 1}`}
                            className="w-full h-48 object-cover rounded-xl cursor-pointer"
                            onClick={() => setSelectedImage(idx + 1)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowGalleryModal(true)}
                      className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                      <span>View All Photos</span>
                    </motion.button>
                  </div>
                </>
              )}


            {/* Tabs */}
            <div className="mb-6 flex gap-4 pb-2 max-md:flex-wrap max-md:justify-center">
              <TabButton
                icon={ClipboardList}
                label="Overview"
                isActive={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
              />
              <TabButton
                icon={Users}
                label="Doctors"
                isActive={activeTab === "doctors"}
                onClick={() => setActiveTab("doctors")}
              />
              <TabButton
                icon={Building2}
                label="Facilities"
                isActive={activeTab === "facilities"}
                onClick={() => setActiveTab("facilities")}
              />
              <TabButton
                icon={MessageCircle}
                label="Reviews"
                isActive={activeTab === "reviews"}
                onClick={() => setActiveTab("reviews")}
              />
            </div>

            {/* Content Grid: Main + Sidebar */}
            <div className="grid grid-cols-3 gap-8 max-md:grid-cols-2 max-sm:mx-auto max-sm:flex max-sm:flex-wrap max-sm:items-center">
              {/* Main Content (col-span-2) */}
              <div className="col-span-2 space-y-8">
                <AnimatePresence mode="wait">
                  {/* ========== OVERVIEW TAB ========== */}
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">
                          About the Hospital
                        </h2>

                        <motion.div
                          animate={{ height: showFullOverview ? "auto" : "6rem" }}
                          className="relative overflow-hidden transition-all"
                        >
                          <p className="text-gray-600 whitespace-pre-line">
                            {hospital?.description}
                          </p>

                          {!showFullOverview && (
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                          )}
                        </motion.div>

                        {/* Toggle Button */}
                        <button
                          onClick={() => setShowFullOverview(!showFullOverview)}
                          className="mt-2 text-[#3252DF] flex items-center gap-1 hover:underline"
                        >
                          <span>
                            {showFullOverview ? "Show Less" : "Read More"}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              showFullOverview ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Highlights */}
                      <div className="grid grid-cols-2 gap-4">
                        {highlights.map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <motion.div
                              key={idx}
                              whileHover={{ scale: 1.02 }}
                              className="bg-white p-4 rounded-xl shadow-lg flex items-start gap-3 max-sm:flex max-sm:flex-col max-sm:items-center"
                            >
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <Icon className="w-5 h-5 text-[#3252DF]" />
                              </div>
                              <div className=" max-sm:flex max-sm:flex-col max-sm:items-center">
                                <h3 className="font-medium">{item.title}</h3>
                                <p className="text-sm text-gray-600 max-sm:self-center max-sm:text-center">
                                  {item.description}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* ========== DOCTORS TAB ========== */}
                  {activeTab === "doctors" && (
                    <motion.div
                      key="doctors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-2xl p-6 shadow-lg space-y-6"
                    >
                      <h2 className="text-xl font-bold mb-4">Our Doctors</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {doctorsList.map((doctor, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                          >
                            <img
                              src={doctor.image}
                              alt={doctor.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-medium">{doctor.name}</h3>
                              <p className="text-sm text-gray-600">
                                {doctor.specialty}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-sm text-gray-500">
                                  {doctor.experience}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-sm font-medium">
                                    {doctor.rating}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ========== FACILITIES TAB ========== */}
                  {activeTab === "facilities" && (
                    <motion.div
                      key="facilities"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-2xl p-6 shadow-lg"
                    >
                      <h2 className="text-xl font-bold mb-6">
                        Facilities & Amenities
                      </h2>
                      <div className="grid grid-cols-2 gap-6">
                        {amenities.map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <motion.div
                              key={idx}
                              whileHover={{ scale: 1.02 }}
                              className="flex items-start gap-3 p-4 rounded-xl hover:bg-blue-50 transition-colors"
                            >
                              <div className="p-2 bg-[#3252DF]/10 rounded-lg">
                                <Icon className="w-5 h-5 text-[#3252DF]" />
                              </div>
                              <div>
                                <h3 className="font-medium">{item.label}</h3>
                                <p className="text-sm text-gray-600">
                                  {item.description}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* ========== REVIEWS TAB ========== */}
                  {activeTab === "reviews" && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-2xl p-6 shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Patient Reviews</h2>
                        <Button className="bg-[#3252DF] text-white">
                          Write a Review
                        </Button>
                      </div>
                      <div className="space-y-6">
                        {reviews.map((review, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="border-b pb-6 last:border-b-0"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{review.user}</span>
                                  <span className="text-sm text-gray-500">
                                    {review.date}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#3252DF]"
                              >
                                <ThumbsUp className="w-4 h-4" />
                                <span>Helpful ({review.helpful})</span>
                              </motion.button>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sidebar (col-span-1) */}
              <div className="space-y-6  max-md:flex max-md:justify-center max-md:flex-wrap max-md:mx-auto max-md:p-3">
                {/* Quick Appointment */}
                {/* <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-[#3252DF] to-[#4466ff] rounded-2xl p-6  text-white shadow-lg max-sm:flex max-sm:flex-col max-sm:justify-center max-sm:items-center"
                >
                  <h3 className="text-lg font-bold mb-4">Book an Appointment</h3>
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                      <Calendar className="w-5 h-5 mb-2" />
                      <p className="font-medium">Next Available:</p>
                      <p className="text-sm opacity-90">Tomorrow, 10:00 AM</p>
                    </div>
                    <a href="/booking">
                    <Button className="w-full bg-white text-[#3252DF] hover:bg-white/90 mt-3">
                      Check Availability
                    </Button>
                    </a>
                  </div>
                </motion.div> */}

                {/* Contact Info */}
                <div className="bg-white rounded-2xl p-6 max-lg:p-3 shadow-lg max-md:mt-0">
                  <h3 className="text-lg font-bold mb-4">{hospital?.contact_number}</h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Phone,
                        value: hospital?.contact_number,
                        label: "Emergency Contact",
                      },
                      {
                        icon: Globe,
                        value: hospital?.email,
                        label: "Website",
                      },
                      { icon: Clock, value: "Open 24/7", label: "Working Hours" },
                    ].map(({ icon: Icon, value, label }, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <div className="p-2 bg-[#3252DF]/10 rounded-lg">
                          <Icon className="w-5 h-5 text-[#3252DF]" />
                        </div>
                        <div>
                          <p className="font-medium">{value}</p>
                          <p className="text-sm text-gray-600">{label}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Emergency Info */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-red-50 rounded-2xl p-6 border border-red-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Phone className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-red-600">Emergency Contact</h3>
                      <p className="text-red-600 mt-1">Call: 911</p>
                      <p className="text-sm text-red-500 mt-2">
                        Available 24/7 for emergency services
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

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
                    onClick={()=>{navigate('/contact')}}
                  >
                    Contact Us
                  </motion.button>
                  <a href="/treatments">
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

          {/* Gallery Modal */}
          <AnimatePresence>
            {showGalleryModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                onClick={() => setShowGalleryModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="max-w-4xl w-full bg-white rounded-2xl p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hospitalImages.map((img, idx) => (
                      <motion.img
                        key={idx}
                        src={img}
                        alt={`Gallery image ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
     </Layout>
  );
};

export default HospitalDetails;
