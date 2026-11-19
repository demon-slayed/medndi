import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Phone,
  Globe,
  Mail,
  Clock,
  Heart,
  Share2,
  Users,
  Award,
  Building2,
  Home,
  Camera,
  BadgeCheck,
  ChevronDown,
  Activity,
  Shield,
  Stethoscope,
  ClipboardList,
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import axios from "axios";
import useAppStore from "@/store/useAppStore";
import toast from "react-hot-toast";

const FALLBACK_HOSPITAL_IMAGE =
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80";
const FALLBACK_DOCTOR_IMAGE =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop";

const TREND_LABELS = { up: "Growing", down: "Declining", stable: "Stable" };

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

const HospitalDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showFullOverview, setShowFullOverview] = useState(false);
  // Page renders from its own state so a previously viewed hospital never flashes;
  // the store copy is kept in sync for the booking flow.
  const [hospital, setLocalHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { setHospital } = useAppStore();
  const { hospital_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const fetchHospital = async () => {
      try {
        window.scrollTo(0, 0);
        setLoading(true);
        setNotFound(false);
        setLocalHospital(null);
        setSelectedImage(0);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/hospitals/${hospital_id}`,
          { withCredentials: true }
        );
        if (cancelled) return;
        setLocalHospital(res.data);
        setHospital(res.data);
      } catch (err) {
        console.error("Error fetching hospital:", err);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHospital();
    return () => {
      cancelled = true;
    };
  }, [hospital_id, setHospital]);

  const handleShowTreatments = () => {
    navigate(`/hospital/${hospital_id}/treatments`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: hospital?.hospital_name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      // user cancelled share dialog; nothing to do
    }
  };

  const hospitalImages = hospital?.hospital_image?.filter(Boolean) ?? [];
  const highlightIcons = [BadgeCheck, Globe, Stethoscope, Clock];
  const statIcons = [Users, Building2, Award, Star];
  const amenityIcons = [Building2, Activity, Shield, Clock, Globe];
  const highlights = (hospital?.highlights ?? []).filter((h) => h?.title);
  const doctors = hospital?.doctors ?? [];
  const amenities = (hospital?.amenities ?? []).filter((a) => a?.label);

  const contactItems = [
    hospital?.contact_number && {
      icon: Phone,
      value: hospital.contact_number,
      label: "Phone",
      href: `tel:${hospital.contact_number.replace(/\s+/g, "")}`,
    },
    hospital?.email && {
      icon: Mail,
      value: hospital.email,
      label: "Email",
      href: `mailto:${hospital.email}`,
    },
    hospital?.website && {
      icon: Globe,
      value: hospital.website.replace(/^https?:\/\//, ""),
      label: "Website",
      href: hospital.website,
      external: true,
    },
    { icon: Clock, value: "Open 24/7", label: "Working Hours" },
  ].filter(Boolean);

  // Minimal breadcrumb bar
  const PageBreadcrumb = () => (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm max-md:flex-wrap">
            <BreadcrumbItem>
              <Home className="w-4 h-4 cursor-pointer" onClick={()=>{navigate('/')}}/>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to="/hospitals" className="hover:text-[#3252DF]">Hospitals</Link>
            </BreadcrumbItem>
            <BreadcrumbItem isLast>{hospital?.hospital_name || "Hospital"}</BreadcrumbItem>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={()=>{navigate('/contact')}}
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

  if (loading || notFound || !hospital) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
          <PageBreadcrumb />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {loading ? (
              <div className="animate-pulse space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-8 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-gray-100 rounded-xl" />
                    ))}
                  </div>
                </div>
                <div className="h-64 bg-white rounded-2xl shadow-lg" />
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Building2 className="w-12 h-12 text-[#3252DF] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Hospital not found</h2>
                <p className="text-gray-600 mb-6">
                  We couldn&apos;t find this hospital. It may have been removed or the link is incorrect.
                </p>
                <Button
                  className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white px-6"
                  onClick={() => navigate("/hospitals")}
                >
                  Browse all hospitals
                </Button>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
     <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">

          {/* Breadcrumb */}
          <PageBreadcrumb />

          {/* Main Wrapper */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* Hospital Title & Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  {/* Accreditation Badge */}
                  {(hospital?.badges?.[0] || hospital?.accreditation) && (
                    <div className="flex items-center gap-3 mb-2">
                      <BadgeCheck className="w-6 h-6 text-[#3252DF]" />
                      <span className="text-sm font-medium text-[#3252DF] bg-blue-50 px-2 py-1 rounded">
                        {hospital?.badges?.[0] || hospital?.accreditation}
                      </span>
                    </div>
                  )}
                  <h1 className="text-3xl max-sm:text-2xl font-bold text-gray-900 mb-2">
                     {hospital?.hospital_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-6 max-sm:gap-2 text-gray-600">
                    {hospital?.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#3252DF]" />
                        <span>{hospital.address}</span>
                      </div>
                    )}
                    {hospital?.rating != null && (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{hospital.rating}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">Open 24/7</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsLiked(!isLiked)}
                    aria-label="Save hospital"
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
                    onClick={handleShare}
                    aria-label="Share hospital"
                    className="p-2 rounded-lg border text-[#3252DF] border-[#3252DF]"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                    <Button className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white px-6" onClick={handleShowTreatments}>
                       Show Treatments
                    </Button>
                </div>
              </div>

              {/* Quick Stats */}
              {hospital?.key_highlights?.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl max-md:grid-cols-2">
                  {hospital.key_highlights.map(({ label, value, trend }, idx) =>{
                    const Icon = statIcons[idx % statIcons.length];
                    return(
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="text-center p-4 bg-white/80 backdrop-blur rounded-xl shadow-sm"
                    >
                      <Icon className="w-6 h-6 text-[#3252DF] mx-auto mb-2" />
                      <p className="font-bold text-xl">{value}</p>
                      <p className="text-sm text-gray-600">{label}</p>
                      {trend && (
                        <p className="text-xs text-[#3252DF] mt-1">{TREND_LABELS[trend] || trend}</p>
                      )}
                    </motion.div>
                  )})}
                </div>
              )}
            </motion.div>

            {/* Image Gallery Section */}
            {hospitalImages.length > 0 && (
              <div className="relative mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Main image (selected) */}
                  <motion.div
                    className={`relative group ${hospitalImages.length > 1 ? "sm:col-span-2 sm:row-span-2" : "sm:col-span-2 md:col-span-4"}`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <img
                      src={hospitalImages[selectedImage] || FALLBACK_HOSPITAL_IMAGE}
                      onError={(e) => { e.currentTarget.src = FALLBACK_HOSPITAL_IMAGE; }}
                      alt={hospital?.hospital_name}
                      className="w-full h-full max-h-[420px] object-cover rounded-2xl"
                    />
                  </motion.div>

                  {/* Thumbnails */}
                  {hospitalImages.length > 1 &&
                    hospitalImages.slice(0, 4).map((img, idx) => (
                      <motion.div
                        key={idx}
                        className="relative group"
                        whileHover={{ scale: 1.02 }}
                      >
                        <img
                          src={img}
                          alt={`${hospital?.hospital_name} view ${idx + 1}`}
                          onError={(e) => { e.currentTarget.src = FALLBACK_HOSPITAL_IMAGE; }}
                          className={`w-full h-48 object-cover rounded-xl cursor-pointer ${
                            selectedImage === idx ? "ring-4 ring-[#3252DF]" : ""
                          }`}
                          onClick={() => setSelectedImage(idx)}
                        />
                      </motion.div>
                    ))}
                </div>
                {hospitalImages.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowGalleryModal(true)}
                    className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                    <span>View All Photos</span>
                  </motion.button>
                )}
              </div>
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

                        {hospital?.description ? (
                          <>
                            <motion.div
                              animate={{ height: showFullOverview || hospital.description.length < 300 ? "auto" : "6rem" }}
                              className="relative overflow-hidden transition-all"
                            >
                              <p className="text-gray-600 whitespace-pre-line">
                                {hospital.description}
                              </p>

                              {!showFullOverview && hospital.description.length >= 300 && (
                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                              )}
                            </motion.div>

                            {hospital.description.length >= 300 && (
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
                            )}
                          </>
                        ) : (
                          <p className="text-gray-500">No description available yet.</p>
                        )}

                        {hospital?.specialties?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {hospital.specialties.map((specialty, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Highlights */}
                      {highlights.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                          {highlights.map((item, idx) => {
                            const Icon = highlightIcons[idx % highlightIcons.length];
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
                      )}
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
                      {doctors.length === 0 ? (
                        <p className="text-gray-500">Doctor profiles will be added soon.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {doctors.map((doctor, idx) => (
                            <motion.div
                              key={doctor?._id || idx}
                              whileHover={{ scale: 1.02 }}
                              className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                            >
                              <img
                                src={doctor?.image || FALLBACK_DOCTOR_IMAGE}
                                onError={(e) => { e.currentTarget.src = FALLBACK_DOCTOR_IMAGE; }}
                                alt={doctor?.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                              <div>
                                <h3 className="font-medium">{doctor?.name}</h3>
                                <p className="text-sm text-gray-600">
                                  {doctor?.specialty}
                                </p>
                                {doctor?.qualifications && (
                                  <p className="text-xs text-gray-500 mt-1">{doctor.qualifications}</p>
                                )}
                                {doctor?.expertise && (
                                  <p className="text-xs text-[#3252DF] mt-1">{doctor.expertise}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                  {doctor?.experience && (
                                    <span className="text-sm text-gray-500">
                                      {doctor.experience}
                                    </span>
                                  )}
                                  {doctor?.rating != null && (
                                    <div className="flex items-center gap-1">
                                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                      <span className="text-sm font-medium">
                                        {doctor.rating}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
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
                      {amenities.length === 0 ? (
                        <p className="text-gray-500">Facility details will be added soon.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-6">
                          {amenities.map((item, idx) => {
                            const Icon = amenityIcons[idx % amenityIcons.length];
                            return (
                              <motion.div
                                key={item?._id || idx}
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
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sidebar (col-span-1) */}
              <div className="space-y-6  max-md:flex max-md:justify-center max-md:flex-wrap max-md:mx-auto max-md:p-3">
                {/* Contact Info */}
                <div className="bg-white rounded-2xl p-6 max-lg:p-3 shadow-lg max-md:mt-0">
                  <h3 className="text-lg font-bold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    {contactItems.map(({ icon: Icon, value, label, href, external }, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <div className="p-2 bg-[#3252DF]/10 rounded-lg">
                          <Icon className="w-5 h-5 text-[#3252DF]" />
                        </div>
                        <div className="min-w-0">
                          {href ? (
                            <a
                              href={href}
                              target={external ? "_blank" : undefined}
                              rel={external ? "noopener noreferrer" : undefined}
                              className="font-medium break-all hover:text-[#3252DF]"
                            >
                              {value}
                            </a>
                          ) : (
                            <p className="font-medium">{value}</p>
                          )}
                          <p className="text-sm text-gray-600">{label}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Emergency Info */}
                {hospital?.contact_number && (
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
                        <a
                          href={`tel:${hospital.contact_number.replace(/\s+/g, "")}`}
                          className="block text-red-600 mt-1"
                        >
                          Call: {hospital.contact_number}
                        </a>
                        <p className="text-sm text-red-500 mt-2">
                          Available 24/7 for emergency services
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Booking CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 bg-gradient-to-r from-[#3252DF] to-[#4466ff] rounded-2xl p-6 sm:p-8 text-white text-center md:text-left"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Ready to Book Your Appointment?
                  </h3>
                  <p className="text-white/90">
                    Choose a treatment at {hospital?.hospital_name} to get started
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-white text-[#3252DF] rounded-xl font-medium"
                    onClick={handleShowTreatments}
                  >
                    Book Now
                  </motion.button>
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
                className="fixed inset-0 bg-black/80 z-[150] flex items-center justify-center p-4"
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
                        onClick={() => {
                          setSelectedImage(idx);
                          setShowGalleryModal(false);
                        }}
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
