import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Shield, ChevronLeft, AlertCircle } from "lucide-react";
import axios from "axios";
import useAppStore from "@/store/useAppStore";
import toast from "react-hot-toast";
import LoadingSkelton from "../LoadingSkelton";

/* 
  This component handles:
  1. Insurance plan selection (Basic/Premium/Comprehensive)
  2. A three-step form for personal/medical/emergency details
*/
const InsuranceSelection = ({ onSelect }) => {
  const [insurances, setInsurances] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const { selectedPlan, setSelectedPlan } = useAppStore();

  const planGradients = [
    "from-blue-500 to-indigo-500",
    "from-[#3252DF] to-[#4466ff]",
    "from-purple-500 to-pink-500",
  ];

  // Collect user form data
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    existingConditions: "",
    emergency: {
      name: "",
      relationship: "",
      phone: "",
    },
  });

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    console.log("plan selected is: ", plan);
    toast.success(`${plan?.name} insurance selected`);
    console.log("selec", selectedPlan);
  };

  useEffect(() => {
    const fetchInsurances = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/insurance/getall`,
          {
            withCredentials: true,
          }
        );
        setInsurances(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching treatments:", error);
      }
        finally{
          setLoading(false);
        }
    };

    fetchInsurances();
  }, []);

  // Single handler for all input fields (including nested emergency object)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      // Nested property (e.g. emergency.name)
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      // Root-level property
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Reusable form input component
  const FormInput = ({
    label,
    name,
    type = "text",
    placeholder,
    required = true,
  }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={
          name.includes(".")
            ? formData[name.split(".")[0]][name.split(".")[1]]
            : formData[name]
        }
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-[#3252DF] 
                  focus:border-transparent outline-none
                  text-sm"
      />
    </div>
  );

  // Stepper Titles
  const stepTitles = [
    "Personal Details",
    "Medical Information",
    "Emergency Contact",
  ];

  // Stepper UI with gradient lines when completed
  const renderStepper = () => {
    return (
      <div className="flex justify-between mb-8">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === step;
          const isCompleted = stepNumber < step;

          return (
            <div key={title} className="flex items-center">
              <div
                className={`flex flex-col items-center transition-colors 
                  ${isActive ? "text-[#3252DF]" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                    }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                </div>
                <span className="text-xs text-center w-16">{title}</span>
              </div>

              {/* Connector line except for the last item */}
              {index < stepTitles.length - 1 && (
                <div
                  className={`w-24 h-0.5 mx-2 transition-colors 
                    ${isCompleted ? "bg-green-500" : "bg-gray-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Renders the insurance plan selection cards
  const renderPlanSelection = () => {
    return (
      <motion.div
        key="planSelection"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className=" rounded-lg shadow-lg p-8"
      >
        <div className="text-center mb-10">
          <Shield className="w-12 h-12 text-[#3252DF] mx-auto " />
          <h2 className="text-2xl font-semibold text-gray-900">
            Choose Your Insurance Plan
          </h2>
          <p className="text-gray-600 mt-2">
            Select the coverage that best suits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
         {
          loading ? ( <LoadingSkelton length={3}/> ) : (insurances?.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* "Recommended" badge if applicable */}
              {plan.recommended && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 
                           bg-gradient-to-r from-yellow-400 to-orange-500 
                           text-white px-4 py-1 rounded-full text-sm font-medium z-10"
                >
                  Recommended
                </div>
              )}

              <div
                // Height controlled here: `h-full` ensures full height of grid cell
                className={`relative h-full p-1 rounded-2xl bg-gradient-to-br ${planGradients[index]} 
                        transform transition-transform group-hover:scale-[1.03] 
                        shadow-lg border border-gray-200`}
              >
                {/* Height also controlled here: `h-full flex flex-col` ensures consistent internal height */}
                <div className="bg-white rounded-2xl p-6 h-full flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {plan.name}
                  </h3>

                  <div className="text-2xl font-bold text-[#3252DF] mb-4">
                    ₹{plan.price}
                    <span className="text-sm font-normal text-gray-600">
                      /year
                    </span>
                  </div>

                  {/* Feature List with flex-grow to distribute remaining space */}
                  <ul className="flex-grow mb-4 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-sm text-gray-600"
                      >
                        <div
                          className="w-5 h-5 rounded-full 
                                 bg-gradient-to-r from-[#3252DF] to-[#4466ff] 
                                 flex items-center justify-center flex-shrink-0"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Select Button */}
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className="w-full py-3 bg-gradient-to-r from-[#3252DF] to-[#4466ff]
                           text-white rounded-lg hover:opacity-90 transition-opacity
                           font-semibold"
                  >
                    Select Plan
                  </button>
                </div>
              </div>
            </motion.div>
          )) )
         }
        </div>
      </motion.div>
    );
  };

  // Renders the multi-step form after selecting a plan
  const renderPlanForm = () => {
    return (
      <motion.div
        key="planForm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedPlan(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Plans
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#3252DF]" />
            <span className="font-medium text-gray-700">
              {selectedPlan.name}
            </span>
          </div>
        </div>

        {/* Stepper */}
        {renderStepper()}

        {/* Form Steps */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <FormInput
                  label="Full Name"
                  name="fullName"
                  placeholder="Enter your full name"
                />
                <FormInput
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                />
                <FormInput
                  label="Phone Number"
                  name="phone"
                  placeholder="Enter your phone number"
                />
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                />
                <FormInput
                  label="Current Address"
                  name="address"
                  placeholder="Enter your current address"
                />
              </motion.div>
            )}

            {/* Step 2: Medical Info */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Existing Medical Conditions
                  </label>
                  <textarea
                    name="existingConditions"
                    value={formData.existingConditions}
                    onChange={handleInputChange}
                    placeholder="Please list any existing medical conditions"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-[#3252DF] focus:border-transparent 
                               outline-none text-sm"
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Important Note
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Please disclose all pre-existing conditions.
                        Non-disclosure may affect your coverage.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Emergency Contact */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <FormInput
                  label="Emergency Contact Name"
                  name="emergency.name"
                  placeholder="Enter emergency contact name"
                />
                <FormInput
                  label="Relationship"
                  name="emergency.relationship"
                  placeholder="Enter relationship with emergency contact"
                />
                <FormInput
                  label="Emergency Contact Phone"
                  name="emergency.phone"
                  placeholder="Enter emergency contact phone number"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep((prev) => prev - 1)}
                className="px-6 py-2 text-sm border border-gray-300 
                           rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            <button
              onClick={() => {
                if (step < 3) {
                  setStep((prev) => prev + 1);
                } else {
                  // When the user completes Step 3
                  onSelect({ plan: selectedPlan, formData });
                }
              }}
              className="ml-auto px-6 py-2 text-sm 
                         bg-gradient-to-r from-[#3252DF] to-[#4466ff] 
                         text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              {step === 3 ? "Complete Application" : "Next"}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {/* If no plan selected yet, show plan cards */}
        {!selectedPlan ? renderPlanSelection() : renderPlanForm()}
      </AnimatePresence>
    </div>
  );
};

export default InsuranceSelection;
