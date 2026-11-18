import React from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Hotel,
  Plane,
  Shield,
  Star,
  Check,
  CircleDot,
} from "lucide-react";

const Stepper = ({ currentStep }) => {
  const steps = [
    {
      number: 1,
      title: "Treatment",
      icon: ClipboardCheck,
      description: "Select your treatment and date",
    },
    {
      number: 2,
      title: "Hotel",
      icon: Hotel,
      description: "Choose your accommodation",
    },
    {
      number: 3,
      title: "Travel",
      icon: Plane,
      description: "Plan your journey",
    },
    {
      number: 4,
      title: "Insurance",
      icon: Shield,
      description: "Get coverage",
    },
    {
      number: 5,
      title: "Review",
      icon: Star,
      description: "Confirm booking",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full py-12 px-4 max-sm:px-0"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between relative">
          {/* Progress bar background with gradient overlay */}
          <div className="absolute top-1/2  left-0 right-0 h-1 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full -translate-y-1/2" />

          {/* Active progress bar with animated gradient */}
          <div
            className="absolute top-1/2  left-0 h-1 rounded-full -translate-y-1/2 transition-all duration-700 ease-in-out bg-gradient-to-r from-[#3252DF] via-[#4466ff] to-[#3252DF] bg-size-200"
            style={{
              width: `${(currentStep - 1) * 25}%`,
              backgroundSize: "200% 100%",
              animation: "gradientMove 2s ease infinite",
            }}
          />

          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep >= step.number;
            const isCurrentStep = currentStep === step.number;

            return (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="relative flex flex-col items-center group"
                style={{ width: "clamp(100px, 15%, 200px)" }}
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-6 max-md:top-5 max-sm:top-4 left-1/2 w-full h-0.5 transition-colors duration-300
                      ${isActive ? "bg-[#3252DF]" : "bg-gray-200"}`}
                  />
                )}

                {/* Step Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrentStep ? 1.1 : 1,
                    backgroundColor: isActive ? "#3252DF" : "#fff",
                  }}
                  whileHover={{ scale: 1.05 }}
                  className={`relative z-10 w-12 h-12 max-sm:w-8 max-sm:h-8 max-md:w-10 max-md:p-1 max-md:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${
                      isActive
                        ? "border-[#3252DF] shadow-lg shadow-blue-200"
                        : "border-gray-300"
                    }
                    ${isCurrentStep ? "ring-4 ring-blue-100" : ""}`}
                >
                  {isActive ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      {isCurrentStep ? (
                        <CircleDot className={`w-6 h-6 text-white`} />
                      ) : (
                        <Check className={`w-6 h-6 text-white`} />
                      )}
                    </motion.div>
                  ) : (
                    <StepIcon className={`w-6 h-6 text-gray-400`} />
                  )}
                </motion.div>

                {/* Step Content */}
                <div className="mt-4 text-center">
                  <span
                    className={`text-sm font-semibold block mb-1 transition-colors duration-300 max-md:text-xs
                    ${isActive ? "text-[#3252DF]" : "text-gray-500"}`}
                  >
                    {step.title}
                  </span>
                  <span className="text-xs text-gray-500 opacity-80 block max-md:hidden">
                    {step.description}
                  </span>
                </div>

                {/* Step Number Badge */}
                <div
                  className={`absolute -top-6 text-xs max-sm:text-[10px] font-medium px-2  rounded-full transition-all duration-300
                  ${
                    isActive
                      ? "bg-[#3252DF] text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  Step {step.number}
                </div>

                {/* Hover Effect */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isCurrentStep ? 1 : 0,
                    scale: isCurrentStep ? 1 : 0.8,
                  }}
                  className="absolute -bottom-2 w-16 h-1 bg-[#3252DF] rounded-full"
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Custom Keyframes for gradient animation */}
      <style jsx>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .bg-size-200 {
          background-size: 200% 100%;
        }
      `}</style>
    </motion.div>
  );
};

export default Stepper;
