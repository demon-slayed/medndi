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

const Stepper = ({ currentStep, onStepClick }) => {
  const steps = [
    {
      number: 1,
      title: "Date",
      icon: ClipboardCheck,
      description: "Pick your appointment",
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

  const current = steps.find((s) => s.number === currentStep);

  return (
    <motion.nav
      aria-label="Booking progress"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-5 sm:px-6 sm:py-6 mb-8"
    >
      <p className="sm:hidden text-center text-sm text-gray-600 mb-4">
        Step {currentStep} of {steps.length}
        {current ? <span className="font-semibold text-[#3252DF]"> · {current.title}</span> : null}
      </p>
      <ol className="flex">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isDone = currentStep > step.number;
          const isCurrentStep = currentStep === step.number;
          const isActive = isDone || isCurrentStep;

          return (
            <li
              key={step.number}
              className="relative flex-1 flex flex-col items-center text-center min-w-0"
              aria-current={isCurrentStep ? "step" : undefined}
            >
              {/* Connector to the next step */}
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute top-4 sm:top-5 left-1/2 w-full h-0.5 transition-colors duration-500 ${
                    isDone ? "bg-[#3252DF]" : "bg-gray-200"
                  }`}
                />
              )}

              <button
                type="button"
                disabled={!isDone || !onStepClick}
                onClick={() => onStepClick?.(step.number)}
                aria-label={isDone ? `Go back to ${step.title}` : step.title}
                className={`relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#3252DF] to-[#4466ff] border-[#3252DF] text-white shadow-md shadow-blue-200"
                    : "bg-white border-gray-300 text-gray-400"
                } ${isCurrentStep ? "ring-4 ring-blue-100" : ""} ${
                  isDone && onStepClick ? "cursor-pointer hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200" : "cursor-default"
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : isCurrentStep ? (
                  <CircleDot className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>

              <span
                className={`mt-2 text-[11px] sm:text-sm font-semibold leading-tight truncate max-w-full px-0.5 ${
                  isActive ? "text-[#3252DF]" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
              <span className="hidden md:block text-xs text-gray-500 mt-0.5 px-1">
                {step.description}
              </span>
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
};

export default Stepper;
