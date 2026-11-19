import React from 'react';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

// Floating "Book Appointment" button. Booking requires choosing a treatment
// (and hospital) first, so this takes the user to the treatments list.
const QuickBookCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50">
      <Button
        onClick={() => {
          navigate('/treatments');
          window.scrollTo(0, 0);
        }}
        className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-full h-12 px-5 sm:h-14 sm:px-6 font-medium text-sm sm:text-base shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
      >
        <Calendar className="w-5 h-5" />
        Book Appointment
      </Button>
    </div>
  );
};

export default QuickBookCTA;
