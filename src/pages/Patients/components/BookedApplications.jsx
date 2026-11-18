import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Star,
  Building2,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Plane,
  Car,
  CreditCard,
  CheckCircle2,
  Phone,
  Mail,
  FileText,
  Download,
  X,
  ChevronRight,
  PiggyBank,
} from "lucide-react";
import useAppStore from "@/store/useAppStore";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import ApplicationStatusStepper from "./ApplicationStatusStepper";

const demoData = {
  treatment: {
    name: "Advanced Cardiac Surgery",
    location: "Fortis Memorial, Gurgaon",
    image: "/assets/hospital2.png",
    rating: 4.9,
    prices: {
      checkup: 240000,
      consultation: 5000,
    },
    doctor: "Dr. Rajesh Kumar",
    department: "Cardiology",
  },
  hotel: {
    name: "The Leela Palace",
    location: "Diplomatic Enclave, New Delhi",
    image: "/assets/hospital2.png",
    rating: 4.8,
    price: 12999,
    roomType: "Deluxe Room",
    nights: 5,
    checkIn: "2024-02-15",
    checkOut: "2024-02-20",
  },
  flight: {
    airline: "Air India",
    departure: "Mumbai (BOM)",
    arrival: "Delhi (DEL)",
    departureTime: "10:00 AM",
    arrivalTime: "12:30 PM",
    date: "2024-02-14",
    price: 5999,
    class: "Economy",
    flightNumber: "AI-213",
  },
  transport: {
    type: "Premium Medical Transport",
    price: 2999,
    features: [
      "24/7 Medical Support",
      "Wheelchair Accessible",
      "Air Conditioned Vehicle",
      "Professional Medical Staff",
    ],
    duration: "5 Days",
  },
  insurance: {
    name: "Premium Medical Coverage",
    price: "3,999",
    features: [
      "Medical expenses up to ₹1,00,000",
      "24/7 support assistance",
      "Ambulance coverage",
      "Room rent covered",
      "Pre & post hospitalization",
    ],
    provider: "Arogya Insurance Co.",
    validity: "1 Year",
  },
};

const BookedApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const {
    // treatment: selectedTreatment,
    // hospital: selectedHospital,
    // selectedHotel: selectedAccommodation,
    // selectedTravelManagement,
    // selectedDateAndTime,
    // selectedPlan: selectedInsurancePlan,
    auth,
  } = useAppStore();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };
  //   const selectedDateAndTime = "Selected: 16 Apr 2025, 9:00 am";

  useEffect(() => {
    if (!showSuccessModal) return;

    const handleClickOutside = () => {
      setShowSuccessModal(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [showSuccessModal]);

  useEffect(() => {
    const fetchApplicationsByUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/application/getByUserId/${
            auth?._id
          }`,
          {
            withCredentials: true,
          }
        );

        const data = res?.data;
        setApplications(data);
        console.log("Applications for user is: ", data);

        // use data[0] directly instead of application[0]
        // setSelectedTreatment(data[0]?.treatment_id);
        // setSelectedHospital(data[0]?.hospital_id);
        // setSelectedAccommodation(data[0]?.hotel_id);
        // setSelectedTravelManagement(data[0]?.travel_plan);
        // setSelectedInsurancePlan(data[0]?.insurance_id);
        // setSelectedDateAndTime(data[0]?.treatmentdateandtime);

        return data;
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        return [];
      }
    };

    fetchApplicationsByUser();
  }, []);

  const handleCardClick = (application) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      initilal_assessment: "bg-yellow-100 text-yellow-800",
      document_verification: "bg-blue-100 text-blue-800",
      board_meeting: "bg-purple-100 text-purple-800",
      travel_accomodation: "bg-indigo-100 text-indigo-800",
      insurance: "bg-emerald-100 text-emerald-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-700";
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // const estimatedTotal =
  //   selectedTreatment?.estimated_cost.max +
  //   (selectedAccommodation?.price_per_night ?? 0) +
  //   (selectedInsurancePlan?.price ?? 0);

  //   const handleConfirm = async () => {
  //     if (!auth || auth?.length == 0) {
  //       return;
  //     }
  //     const res = await axios.post(
  //       `${import.meta.env.VITE_BASE_URL}/application/create`,
  //       {
  //         user_id: auth?._id,
  //         treatment_id: selectedTreatment?._id,
  //         hospital_id: selectedHospital?._id,
  //         hotel_id: selectedAccommodation?._id,
  //         travel_plan: selectedTravelManagement,
  //         insurance_id: selectedInsurancePlan?._id,
  //         total_cost: estimatedTotal,
  //       },
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     setShowSuccessModal(true);
  //   };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        My Medical Bookings
      </h1>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-xl text-gray-600">No bookings found</h3>
          <p className="mt-2 text-gray-500">
            Your medical tourism bookings will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application) => (
            <div
              key={application._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCardClick(application)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-blue-800 truncate">
                    {application.treatment_id?.treatment_name || "Treatment"}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                      `${application?.status}`
                    )}`}
                  >
                    {application?.status}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(application.treatmentdateandtime)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <svg
                    className="w-4 h-4 mr-1 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    ></path>
                  </svg>
                  <span className="truncate">
                    {application.hospital_id?.hospital_name || "Hospital"}
                  </span>
                </div>

                <div className="pt-4 border-t flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Total Cost</p>
                    <p className="text-lg font-bold text-blue-700">
                      ₹
                      {(
                        (application.treatment_id?.estimated_cost?.max || 0) +
                        (application.hotel_id?.price_per_night || 0) +
                        (application.insurance_id?.price || 0)
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <span className="text-sm font-medium mr-1">
                      View Details
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mt-40"
            >
              <div className="sticky top-0 z-10 flex justify-between items-center bg-white p-6 border-b">
                <h2 className="text-2xl font-bold text-blue-800">
                  Booking Details
                </h2>
                <button
                  onClick={closeDetailModal}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-8 text-center">
                  <h1 className="text-4xl font-bold text-blue-800">
                    Booking Confirmed
                  </h1>
                  <p className="text-gray-600 text-lg mt-2">
                    Your medical tourism package
                  </p>
                </div>

                {/* Appointment details */}
                <div className="mb-6 bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
                  <h2 className="font-bold text-xl text-blue-800 mb-2">
                    Appointment Details
                  </h2>
                  <p className="text-blue-700 font-medium text-lg">
                    {formatDate(selectedApplication.treatmentdateandtime)}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Treatment Details */}
                  <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="font-bold text-xl text-gray-800 mb-3 flex items-center">
                      <svg
                        className="w-6 h-6 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        ></path>
                      </svg>
                      Treatment
                    </h2>
                    <div className="pl-3 border-l-2 border-blue-400">
                      <p className="font-medium text-gray-800 text-lg">
                        {selectedApplication.treatment_id?.treatment_name}
                      </p>
                      <p className="text-base text-gray-600">
                        Duration: {selectedApplication.treatment_id?.duration}
                      </p>
                      <p className="text-base text-gray-600">
                        Success Rate:{" "}
                        {selectedApplication.treatment_id?.success_rate}
                      </p>
                      <p className="text-base font-medium text-gray-800 mt-2">
                        Cost: ₹
                        {selectedApplication.treatment_id?.estimated_cost?.min?.toLocaleString()}{" "}
                        - ₹
                        {selectedApplication.treatment_id?.estimated_cost?.max?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Hospital Details */}
                  <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="font-bold text-xl text-gray-800 mb-3 flex items-center">
                      <svg
                        className="w-6 h-6 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        ></path>
                      </svg>
                      Hospital
                    </h2>
                    <div className="pl-3 border-l-2 border-blue-400">
                      <p className="font-medium text-gray-800 text-lg">
                        {selectedApplication.hospital_id?.hospital_name}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500 mr-1 text-lg">★</span>
                        <span className="text-base text-gray-600">
                          {selectedApplication.hospital_id?.rating}/5
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedApplication.hospital_id?.address}
                      </p>
                    </div>
                  </div>

                  {/* Insurance */}
                  <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="font-bold text-xl text-gray-800 mb-3 flex items-center">
                      <svg
                        className="w-6 h-6 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        ></path>
                      </svg>
                      Insurance
                    </h2>
                    <div className="pl-3 border-l-2 border-blue-400">
                      <p className="font-medium text-gray-800 text-lg">
                        {selectedApplication.insurance_id?.name ||
                          "Not selected"}
                      </p>
                      {selectedApplication.insurance_id?.features && (
                        <ul className="text-base text-gray-600 mt-2 list-disc list-inside">
                          {selectedApplication.insurance_id?.features?.map(
                            (feature, index) => (
                              <li key={index}>{feature}</li>
                            )
                          )}
                        </ul>
                      )}
                      {selectedApplication.insurance_id?.price ? (
                        <p className="text-base font-medium text-gray-800 mt-2">
                          ₹
                          {selectedApplication.insurance_id?.price?.toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-base text-gray-600">Not selected</p>
                      )}
                    </div>
                  </div>

                  {/* Accommodation */}
                  <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="font-bold text-xl text-gray-800 mb-3 flex items-center">
                      <svg
                        className="w-6 h-6 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        ></path>
                      </svg>
                      Accommodation
                    </h2>
                    <div className="pl-3 border-l-2 border-blue-400">
                      <p className="font-medium text-gray-800 text-lg">
                        {selectedApplication.hotel_id?.hotel_name ||
                          "Not selected"}
                      </p>
                      {selectedApplication.hotel_id?.distance && (
                        <p className="text-base text-gray-600">
                          {selectedApplication.hotel_id?.distance}
                        </p>
                      )}
                      {selectedApplication.hotel_id?.price_per_night ? (
                        <p className="text-base font-medium text-gray-800 mt-2">
                          ₹
                          {selectedApplication.hotel_id?.price_per_night?.toLocaleString()}{" "}
                          per night
                        </p>
                      ) : (
                        <p className="text-base text-gray-600">Not selected</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Travel Details */}
                <div className="mb-6 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h2 className="font-bold text-xl text-gray-800 mb-3 flex items-center">
                    <svg
                      className="w-6 h-6 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                    Travel Details
                  </h2>
                  {selectedApplication.travel_plan &&
                  selectedApplication.travel_plan?.travelMode ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="pl-3 border-l-2 border-blue-400">
                        <div className="flex items-center text-base">
                          <span className="font-medium text-gray-700">
                            From:
                          </span>
                          <span className="ml-2 text-gray-800">
                            {selectedApplication.travel_plan?.sourceCity ||
                              "Not specified"}
                          </span>
                        </div>
                        <div className="flex items-center text-base mt-2">
                          <span className="font-medium text-gray-700">To:</span>
                          <span className="ml-2 text-gray-800">
                            {selectedApplication.travel_plan?.destinationCity ||
                              "Not specified"}
                          </span>
                        </div>
                      </div>
                      <div className="pl-3 border-l-2 border-blue-400">
                        <div className="flex items-center text-base">
                          <span className="font-medium text-gray-700">
                            Mode:
                          </span>
                          <span className="ml-2 text-gray-800 capitalize">
                            {selectedApplication.travel_plan?.travelMode ||
                              "Not specified"}
                          </span>
                        </div>
                        <div className="flex items-center text-base mt-2">
                          <span className="font-medium text-gray-700 mr-2">
                            Local Transport:
                          </span>
                          {selectedApplication.travel_plan
                            ?.selectedLocalTransport ? (
                            <span className="ml-2 text-gray-800">
                              {
                                selectedApplication.travel_plan
                                  ?.selectedLocalTransport
                              }
                            </span>
                          ) : (
                            <span className="text-base text-gray-600">
                              Not selected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-base text-gray-600">Not selected</p>
                  )}
                </div>

                {/* Cost Summary */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-6">
                  <h2 className="font-bold text-xl text-gray-800 mb-3">
                    Cost Summary
                  </h2>
                  <div className="grid grid-cols-2 gap-3 text-base">
                    <div className="text-gray-600">Treatment (estimated):</div>
                    <div className="text-right font-medium">
                      ₹
                      {selectedApplication.treatment_id?.estimated_cost?.max?.toLocaleString() ||
                        "0"}
                    </div>

                    <div className="text-gray-600">Accommodation:</div>
                    <div className="text-right font-medium">
                      {selectedApplication.hotel_id?.price_per_night != null ? (
                        `₹${selectedApplication.hotel_id.price_per_night.toLocaleString()}`
                      ) : (
                        <span className="text-gray-600">Not selected</span>
                      )}
                    </div>

                    <div className="text-gray-600">Insurance:</div>
                    <div className="text-right font-medium">
                      {selectedApplication.insurance_id?.price != null ? (
                        `₹${selectedApplication.insurance_id.price.toLocaleString()}`
                      ) : (
                        <span className="text-gray-600">Not selected</span>
                      )}
                    </div>

                    <div className="text-gray-600">Travel:</div>
                    {selectedApplication.travel_plan?.travelMode ? (
                      <div className="text-right font-medium">
                        Travel cost update after review
                      </div>
                    ) : (
                      <span className="text-gray-600 text-right font-medium">
                        Not selected
                      </span>
                    )}
                    <div className="border-t pt-2 text-gray-800 font-medium text-lg">
                      Estimated Total:
                    </div>
                    <div className="border-t pt-2 text-right text-blue-700 font-bold text-lg">
                      ₹
                      {(
                        (selectedApplication.treatment_id?.estimated_cost
                          ?.max || 0) +
                        (selectedApplication.hotel_id?.price_per_night || 0) +
                        (selectedApplication.insurance_id?.price || 0)
                      ).toLocaleString()}{" "}
                      onwards
                      <div className="mt-2 flex justify-end">
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Payment Done
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                  {/* <button
                    className="py-3 px-8 bg-blue-600 text-white rounded text-lg hover:bg-blue-700 font-medium"
                    onClick={() => {
                      // window.print()
                      closeDetailModal();
                      setShowSuccessModal(true);
                    }}
                  >
                    Download Receipt
                  </button> */}
                </div>
              </div>
              <motion.div {...fadeIn} className="lg:col-span-2">
                <Card className="w-full max-w-4xl mx-auto">
                  <CardHeader>
                    <CardTitle>Application Progress</CardTitle>
                    <CardDescription>
                      Estimated processing time: 7-10 business days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ApplicationStatusStepper
                      currentStatus={selectedApplication?.status}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal (can be reused from your original code) */}
      <AnimatePresence>
        {showSuccessModal && selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-lg w-full mx-auto"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Booking Confirmed!
                </h3>
                <p className="text-gray-600 mb-6">
                  Thank you for your booking. Your medical journey is confirmed
                  and details have been sent to your email.
                </p>

                {/* Booking Details Summary */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Booking ID</span>
                        <span className="font-medium">
                          ARG-2024-{Math.floor(Math.random() * 10000)}
                        </span>
                      </div>

                      {/* Cost Breakdown Section */}
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <h4 className="font-medium mb-2 text-gray-800">
                          Cost Breakdown
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                              Treatment Cost
                            </span>
                            <span className="font-medium">
                              ₹
                              {selectedApplication.treatment_id?.estimated_cost?.max?.toLocaleString() ||
                                "0"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                              Hotel Accommodation
                            </span>
                            <span className="font-medium">
                              {selectedApplication.hotel_id?.price_per_night !=
                              null ? (
                                `₹${selectedApplication.hotel_id.price_per_night.toLocaleString()}`
                              ) : (
                                <span className="text-gray-600">
                                  Not selected
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                              Insurance Coverage
                            </span>
                            <span className="font-medium">
                              {selectedApplication.insurance_id?.price !=
                              null ? (
                                `₹${selectedApplication.insurance_id.price.toLocaleString()}`
                              ) : (
                                <span className="text-gray-600">
                                  Not selected
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                              Travel Accommodation
                            </span>
                            <span className="font-medium">
                              {selectedApplication.travel_plan?.travelMode ? (
                                "Cost update after review"
                              ) : (
                                <span className="text-gray-600">
                                  Not selected
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between items-center font-semibold">
                          <span className="text-gray-800">Amount Paid</span>
                          <span className="text-blue-700">
                            ₹
                            {(
                              (selectedApplication.treatment_id?.estimated_cost
                                ?.max || 0) +
                              (selectedApplication.hotel_id?.price_per_night ||
                                0) +
                              (selectedApplication.insurance_id?.price || 0)
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                        <span className="text-blue-700 font-medium">
                          Treatment Date
                        </span>
                        <span className="font-semibold text-blue-800">
                          {formatDate(selectedApplication.treatmentdateandtime)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">
                        Important Information
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span>
                            Mark your calendar to avoid missing your treatment
                            appointment.
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>
                            Please arrive 30 minutes before appointment
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span>Bring all relevant medical documents</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Contact Support</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <span>+91 1800 123 4567</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span>support@arogini.com</span>
                          <span>support@arogini.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      window.print();
                    }}
                    className="flex-1 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Receipt
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookedApplications;
