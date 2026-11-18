import React, { useState } from 'react';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const QuickBookCTA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const locations = [
    "New York, USA",
    "London, UK",
    "Singapore",
    "Dubai, UAE",
    "Tokyo, Japan"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Main CTA Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-full px-6 py-6 font-medium text-lg shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2"
      >
        <Calendar className="w-5 h-5" />
        Book Appointment
      </Button>

      {/* Quick Book Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 relative animate-in slide-in-from-bottom duration-300">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-[#152C5B] mb-6">Quick Appointment</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select Location</label>
                <div className="grid grid-cols-2 gap-2">
                  {locations.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => setSelectedLocation(location)}
                      className={`p-3 text-sm rounded-lg border transition-all duration-200 flex items-center gap-2
                        ${selectedLocation === location 
                          ? 'border-[#3252DF] bg-blue-50 text-[#3252DF]' 
                          : 'border-gray-200 hover:border-[#3252DF] hover:bg-blue-50'
                        }`}
                    >
                      <MapPin className="w-4 h-4" />
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Available Time Slots</label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:00', '11:30', '14:00', '16:30', '18:00', '19:30'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      className="p-2 text-sm rounded-lg border border-gray-200 hover:border-[#3252DF] hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-1"
                    >
                      <Clock className="w-4 h-4" />
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white py-6 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
              >
                Confirm Booking
              </Button>
            </form>

            {/* Success Message */}
            {showSuccess && (
              <Alert className="mt-4 bg-green-50 border-green-200">
                <AlertTitle className="text-green-800">Success!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your appointment has been scheduled. Check your email for details.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickBookCTA;