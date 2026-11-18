import React, { useContext, useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import useAppStore from "@/store/useAppStore";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star,
  Shield,
  Users,
  Activity,
  Hospital,
  Heart,
  MessageSquare,
  Award,
  Clock,
  ChevronRight,
  Lock,
  ThumbsUp,
  Stethoscope,
  Calendar,
  FileText,
  Phone,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  BarChart,
  MapPin,
  DollarSign,
  Home,
  Search,
  PlayCircle,
  ClipboardCheck,
  ScrollText,
  Gift,
  HandHeart,
} from "lucide-react";
import axios from "axios";
// import { TreatmentInfoContext } from '@/context/TreatmentInfo';

export const BreadcrumbItem = ({ children, isLast }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center"
  >
    <span
      className={`${
        isLast
          ? "text-gray-600"
          : "text-[#3252DF] hover:text-[#4466ff] cursor-pointer"
      }`}
    >
      {children}
    </span>
    {!isLast && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
  </motion.div>
);

const TreatmentInfo = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);
  // const {treatment, setTreatment} = useContext(TreatmentInfoContext);
  const { treatment, setTreatment, setHospital } = useAppStore();
  const navigate = useNavigate();
  const { treatment_id } = useParams();

  useEffect(() => {
    console.log("treatment id: ", treatment_id);

    const fetchTreatment = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/treatments/${treatment_id}`,
          { withCredentials: true }
        );
        setTreatment(res.data);
        setHospital(res?.data?.available_hospitals[0]);
        console.log("treatment is: ", res?.data);
        console.log("hospital is: ", res?.data?.available_hospitals[0]);
      } catch (err) {
        console.error("Failed to fetch treatment:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [treatment_id]);

  const PageBreadcrumb = () => (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-8 py-4 ">
        <div className="flex items-center justify-between max-sm:mt-4">
          <div className="flex items-center flex-wrap gap-2 text-sm max-sm:text-xs">
            <BreadcrumbItem>
              <Home
                className="w-4 h-4"
                onClick={() => {
                  navigate("/");
                }}
              />
            </BreadcrumbItem>
            <BreadcrumbItem>Medical Treatments</BreadcrumbItem>
            <BreadcrumbItem>{treatment?.treatment_name}</BreadcrumbItem>
            <BreadcrumbItem isLast>Treatment Info</BreadcrumbItem>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-[#3252DF]/10 rounded-lg text-[#3252DF]"
            >
              <Phone className="w-4 h-4" />
              <span
                className="text-sm max-sm:text-xs font-medium"
                onClick={() => {
                  navigate("/contact");
                }}
              >
                Get Expert Help
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );

  const HeroSection = () => (
    <div className="space-y-8 max-sm:mx-auto max-sm:items-center max-sm:text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {treatment?.features?.map((feature, index) => (
          <div
            key={index}
            className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full mr-2 mb-2"
          >
            <Stethoscope className="w-4 h-4 text-[#3252DF] mr-2" />
            <span className="text-sm font-medium text-[#3252DF]">
              {feature}
            </span>
          </div>
        ))}

        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold max-sm:text-3xl">
            <span className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">
              {treatment?.treatment_name}
            </span>
          </h1>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-[#3252DF]" />
            <p className="text-gray-600 text-lg">{treatment?.location}</p>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl max-sm:text-base">
            {treatment?.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 max-sm:justify-center">
          {[
            { icon: Award, text: "JCI Accredited", color: "text-[#3252DF]" },
            {
              icon: Star,
              text: `${treatment?.rating}/5 (500+ reviews)`,
              color: "text-yellow-500",
            },
            {
              icon: Shield,
              text: "Insurance Covered",
              color: "text-green-500",
            },
          ].map((badge, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm"
            >
              <badge.icon className={`w-5 h-5 ${badge.color}`} />
              <span className="font-medium">{badge.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {[
          {
            icon: ThumbsUp,
            value: `${treatment?.success_rate}`,
            label: "Success Rate",
            sublabel: "5000+ surgeries",
          },
          {
            icon: Hospital,
            value: `${treatment?.available_hospitals?.length}`,
            label: "Top Hospitals",
            sublabel: "Nationwide network",
          },
          {
            icon: Clock,
            value: `${treatment?.experience?.slice(0, 9)}`,
            label: "Experience",
            sublabel: "Expert surgeons",
          },
          {
            icon: Users,
            value: "24/7",
            label: "Support",
            sublabel: "Always available",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-6 shadow-lg group hover:shadow-xl transition-all"
          >
            <div className="space-y-3 max-md:flex flex-col items-center">
              <stat.icon className="w-8 h-8 text-[#3252DF] flex self-center" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm font-medium text-gray-700">
                  {stat.label}
                </p>
                <p className="text-xs text-gray-500">{stat.sublabel}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  const BookingCard = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky top-24"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-md:mx-auto">
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <span className="text-sm text-[#3252DF] font-medium">
              Treatment Cost
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">
                ₹{treatment?.estimated_cost?.min}
              </span>
              <span className="text-gray-500">onwards</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">
                Insurance & EMI Available
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: Calendar,
                text: "Next Available: Tomorrow",
                color: "text-purple-600",
              },
              {
                icon: Clock,
                text: "Free Consultation",
                color: "text-blue-600",
              },
              {
                icon: Gift,
                text: "Free Pre-surgery Tests",
                color: "text-green-600",
              },
            ].map((info, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 5 }}
                className="flex items-center gap-3"
              >
                <div className={`p-2 rounded-lg bg-gray-50 ${info.color}`}>
                  <info.icon className="w-4 h-4" />
                </div>
                <span className="text-sm text-gray-600">{info.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
              onClick={() => {
                navigate("/booking");
              }}
            >
              Book Free Consultation
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 border-2 border-[#3252DF] text-[#3252DF] rounded-xl font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              onClick={() => {
                navigate("/contact");
              }}
            >
              <Phone className="w-4 h-4" />
              Talk to Expert
            </motion.button>
          </div>

          {/* <div className="pt-4 border-t space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <Lock className="w-5 h-5 text-[#3252DF] flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">100% Confidential</p>
                <p className="text-sm text-gray-600">Your information is secure with us</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>50+ people booked this week</span>
            </div>
          </div> */}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3252DF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4466ff]/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative">
        <PageBreadcrumb />

        <div className="max-w-7xl mx-auto px-8 py-12 items-center">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <HeroSection />
              {/* Add your treatment content sections here */}
            </div>
            <div className="lg:col-span-1">
              <BookingCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentInfo;
