import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';

const SuccessModal = ({ isVisible, selectedDate, bookingId, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Booking request submitted</h3>
              <p className="text-gray-600 mb-6">
                Our care team will review your request and keep you updated from your dashboard.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Booking ID</span>
                  <span className="font-medium">{bookingId || "—"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Appointment Date</span>
                  <span className="font-medium">{selectedDate?.toLocaleDateString?.("en-IN") || "—"}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                type="button"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
              >
                View Booking Details
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
