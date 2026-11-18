import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Shield } from "lucide-react";
import axios from "axios";
import useAppStore from "@/store/useAppStore";
import toast from "react-hot-toast";
import LoadingSkelton from "../LoadingSkelton";

/* 
  This component handles:
  1. Insurance plan selection (Basic/Premium/Comprehensive)
  2. A three-step form for personal/medical/emergency details
*/
const InsuranceSelection = () => {
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedPlan, setSelectedPlan } = useAppStore();

  const planGradients = [
    "from-blue-500 to-indigo-500",
    "from-[#3252DF] to-[#4466ff]",
    "from-purple-500 to-pink-500",
    "from-emerald-500 to-teal-500",
  ];

  const handleSelectPlan = (plan) => {
    // Tapping the selected plan again removes it
    if (selectedPlan?._id === plan._id) {
      setSelectedPlan([]);
      return;
    }
    setSelectedPlan(plan);
    toast.success(`${plan?.name} added`);
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
        setInsurances(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching treatments:", error);
      }
        finally{
          setLoading(false);
        }
    };

    fetchInsurances();
  }, []);

  // Renders the insurance plan selection cards
  const renderPlanSelection = () => {
    return (
      <motion.div
        key="planSelection"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-2xl shadow-lg p-4 sm:p-8"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:p-4">
         {
          loading ? ( <LoadingSkelton length={3}/> ) : (insurances?.map((plan, index) => (
            <motion.div
              key={plan._id ?? plan.name}
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
                className={`relative h-full p-1 rounded-2xl bg-gradient-to-br ${planGradients[index % planGradients.length]} 
                        transform transition-transform group-hover:scale-[1.03] 
                        shadow-lg border ${selectedPlan?._id === plan._id ? "border-[#3252DF] ring-4 ring-blue-100" : "border-gray-200"}`}
              >
                {/* Height also controlled here: `h-full flex flex-col` ensures consistent internal height */}
                <div className="bg-white rounded-2xl p-6 h-full flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {plan.name}
                  </h3>

                  <div className="text-2xl font-bold text-[#3252DF] mb-4">
                    ₹{plan.price?.toLocaleString()}
                    <span className="text-sm font-normal text-gray-600">
                      /year
                    </span>
                  </div>

                  {/* Feature List with flex-grow to distribute remaining space */}
                  <ul className="flex-grow mb-4 space-y-3">
                    {plan.features?.map((feature, idx) => (
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
                    type="button"
                    onClick={() => handleSelectPlan(plan)}
                    aria-pressed={selectedPlan?._id === plan._id}
                    className={`w-full py-3 rounded-lg font-semibold transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2 ${
                      selectedPlan?._id === plan._id
                        ? "bg-green-50 text-green-700 border-2 border-green-500 inline-flex items-center justify-center gap-2"
                        : "bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white hover:opacity-90"
                    }`}
                  >
                    {selectedPlan?._id === plan._id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Selected · tap to remove
                      </>
                    ) : (
                      "Select plan"
                    )}
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

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {renderPlanSelection()}
      </AnimatePresence>
    </div>
  );
};

export default InsuranceSelection;
