import React, { useState } from "react";
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
  PiggyBank,
} from "lucide-react";
import useAppStore from "@/store/useAppStore";
import toast from "react-hot-toast";
import axios from "axios";

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

const BookingReview = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("card");
  const {
    treatment: selectedTreatment,
    hospital: selectedHospital,
    selectedHotel: selectedAccommodation,
    selectedTravelManagement,
    selectedDateAndTime,
    selectedPlan: selectedInsurancePlan,
    auth,
  } = useAppStore();



  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Secure payment via credit or debit card",
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: Building2,
      description: "Direct bank transfer",
    },
    {
      id: "upi",
      name: "UPI",
      icon: PiggyBank,
      description: "Pay using UPI apps",
    },
  ];

  // const selectedDateAndTime = "Selected: 16 Apr 2025, 9:00 am";

  // const selectedTravelManagement = {
  //   sourceCity: "Bangalore",
  //   destinationCity: "Mumbai",
  //   travelMode: "flight",
  //   selectedLocalTransport: "Medical Transport",
  // };

  // Calculate estimated total cost
  const estimatedTotal =
    selectedTreatment?.estimated_cost.max +
    (selectedAccommodation?.price_per_night ?? 0) +
    (selectedInsurancePlan?.price ?? 0);


    const handleConfirm = async () => {
      if (!auth || auth?.length == 0) {
        toast.error("please login for booking");
        return;
      }
  
      toast.success("Booking confirmed")
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/application/create`,
        {
          user_id: auth?._id,
          treatment_id: selectedTreatment?._id,
          hospital_id: selectedHospital?._id,
          hotel_id: selectedAccommodation?._id,
          travel_plan: selectedTravelManagement,
          insurance_id: selectedInsurancePlan?._id,
          total_cost: estimatedTotal,
          treatmentdateandtime: selectedDateAndTime
        },
        {
          withCredentials: true
        }
      );
      
      setShowSuccessModal(true);
    };

  return (
    <>
      <div className=" mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-800">Booking Review</h1>
          <p className="text-gray-600 text-lg mt-2">
            Please review your medical tourism package
          </p>
        </div>

        {/* Appointment details */}
        <div className="mb-6 bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
          <h2 className="font-bold text-xl text-blue-800 mb-2">
            Appointment Details
          </h2>
          <p className="text-blue-700 font-medium text-lg">
            {selectedDateAndTime}
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
                {selectedTreatment.treatment_name}
              </p>
              <p className="text-base text-gray-600">
                Duration: {selectedTreatment.duration}
              </p>
              <p className="text-base text-gray-600">
                Success Rate: {selectedTreatment.success_rate}
              </p>
              <p className="text-base font-medium text-gray-800 mt-2">
                Cost: ₹{selectedTreatment?.estimated_cost.min?.toLocaleString()}{" "}
                - ₹{selectedTreatment?.estimated_cost?.max?.toLocaleString()}
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
                {selectedHospital.hospital_name}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500 mr-1 text-lg">★</span>
                <span className="text-base text-gray-600">
                  {selectedHospital.rating}/5
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {selectedHospital.address}
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
                {selectedInsurancePlan?.name}
              </p>
              <ul className="text-base text-gray-600 mt-2 list-disc list-inside">
                {selectedInsurancePlan?.features?.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              {selectedInsurancePlan?.price ? (
                <p className="text-base font-medium text-gray-800 mt-2">
                  ₹{selectedInsurancePlan?.price?.toLocaleString()}
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
                {selectedAccommodation.hotel_name}
              </p>
              <p className="text-base text-gray-600">
                {selectedAccommodation.distance}
              </p>
              {selectedAccommodation?.price_per_night ? (
                <p className="text-base font-medium text-gray-800 mt-2">
                  ₹{selectedAccommodation.price_per_night?.toLocaleString()} per
                  night
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
          {selectedTravelManagement && selectedTravelManagement?.travelMode ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="pl-3 border-l-2 border-blue-400">
                <div className="flex items-center text-base">
                  <span className="font-medium text-gray-700">From:</span>
                  <span className="ml-2 text-gray-800">
                    {selectedTravelManagement?.sourceCity}
                  </span>
                </div>
                <div className="flex items-center text-base mt-2">
                  <span className="font-medium text-gray-700">To:</span>
                  <span className="ml-2 text-gray-800">
                    {selectedTravelManagement?.destinationCity}
                  </span>
                </div>
              </div>
              <div className="pl-3 border-l-2 border-blue-400">
                <div className="flex items-center text-base">
                  <span className="font-medium text-gray-700">Mode:</span>
                  <span className="ml-2 text-gray-800 capitalize">
                    {selectedTravelManagement?.travelMode}
                  </span>
                </div>
                <div className="flex items-center text-base mt-2">
                  <span className="font-medium text-gray-700 mr-2">
                    Local Transport:
                  </span>
                  {selectedTravelManagement?.selectedLocalTransport ? (
                    <span className="ml-2 text-gray-800">
                      {selectedTravelManagement?.selectedLocalTransport}
                    </span>
                  ) : (
                    <p className="text-base text-gray-600"> Not selected</p>
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
          <h2 className="font-bold text-xl text-gray-800 mb-3">Cost Summary</h2>
          <div className="grid grid-cols-2 gap-3 text-base">
            <div className="text-gray-600">Treatment (estimated):</div>
            <div className="text-right font-medium">
              ₹{selectedTreatment?.estimated_cost.max?.toLocaleString()}
            </div>

            <div className="text-gray-600">Accommodation:</div>
            <div className="text-right font-medium">
              {selectedAccommodation?.price_per_night != null ? (
                `₹${selectedAccommodation.price_per_night.toLocaleString()}`
              ) : (
                <span className="text-gray-600">Not selected</span>
              )}
            </div>

            <div className="text-gray-600">Insurance:</div>
            <div className="text-right font-medium">
              {selectedInsurancePlan?.price != null ? (
                `₹${selectedInsurancePlan.price.toLocaleString()}`
              ) : (
                <span className="text-gray-600">Not selected</span>
              )}
            </div>

            <div className="text-gray-600">Travel:</div>
            {selectedTravelManagement?.travelMode ? (
              <div className="text-right font-medium">
                Cost update after review
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
              ₹{estimatedTotal?.toLocaleString()} onwards
            </div>
          </div>
        </div>

        {/* Payment method Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-8 mb-8">
            {/* select payment method */}
            <div className="mt-6">
              <h4 className="font-medium mb-4">Select Payment Method</h4>
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all
                            ${
                              selectedPayment === method.id
                                ? "border-2 border-[#3252DF] bg-blue-50"
                                : "border border-gray-200 hover:border-[#3252DF]"
                            }`}
                    >
                      <div
                        className={`p-2 rounded-full ${
                          selectedPayment === method.id
                            ? "bg-[#3252DF] text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium max-sm:text-sm">
                          {method.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {method.description}
                        </div>
                      </div>
                      {selectedPayment === method.id && (
                        <Check className="w-5 h-5 text-[#3252DF] ml-auto" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* <button
                    onClick={handleConfirm}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Confirm Booking
                  </button> */}

              <p className="mt-4 text-sm text-gray-600 text-center">
                By confirming your booking, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button className="py-3 px-6 bg-gray-200 text-gray-800 rounded text-lg hover:bg-gray-300 font-medium">
            Edit Booking
          </button>
          <button
            className="py-3 px-8 bg-blue-600 text-white rounded text-lg hover:bg-blue-700 font-medium"
            onClick={handleConfirm}
          >
            Confirm Booking
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto max-h-screen pt-[460px]"
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
                        <span className="font-medium">ARG-2024-1234</span>
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
                              ₹{selectedTreatment?.estimated_cost.max}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                              Hotel Accommodation
                            </span>
                            <span className="font-medium">
                              {selectedAccommodation?.price_per_night !=
                              null ? (
                                `₹${selectedAccommodation.price_per_night}`
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
                              {selectedInsurancePlan?.price != null ? (
                                `₹${selectedInsurancePlan.price}`
                              ) : (
                                <span className="text-gray-600">
                                  Not selected
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                              Travel Accomodation
                            </span>
                            <span className="font-medium">
                              {selectedTravelManagement?.travelMode ? (
                                "Cost update after review"
                              ) : (
                                <span className="text-gray-600">
                                  Not selected
                                </span>
                              )}
                            </span>
                          </div>

                          {/* {otherCosts > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Other Expenses</span>
                        <span className="font-medium">₹{otherCosts}</span>
                      </div>
                    )} */}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between items-center font-semibold">
                          <span className="text-gray-800">Amount Paid</span>
                          <span className="text-[#3252DF]">
                            ₹{estimatedTotal}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                        <span className="text-blue-700 font-medium">
                          Treatment Date
                        </span>
                        <span className="font-semibold text-blue-800">
                          {selectedDateAndTime}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">
                        Important Information
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#3252DF]" />
                          <span>
                            Mark your calendar to avoid missing your treatment
                            appointment.
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#3252DF]" />
                          <span>
                            Please arrive 30 minutes before appointment
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#3252DF]" />
                          <span>Bring all relevant medical documents</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Contact Support</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#3252DF]" />
                          <span>+91 1800 123 4567</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#3252DF]" />
                          <span>support@arogini.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 border border-[#3252DF] text-[#3252DF] rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Receipt
                  </button>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="flex-1 py-3 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    View Booking Details
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BookingReview;
