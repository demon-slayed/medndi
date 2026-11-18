import React, { useState } from 'react';
import Stepper from '@/components/booking/Stepper';
import AppointmentCalendar from '@/components/booking/AppointmentCalendar';
import TreatmentCard from '@/components/booking/TreatmentCard';
import HotelSelection from '@/components/booking/HotelSelection';
import TravelSelection from '@/components/booking/TravelSelection';
import InsuranceSelection from '@/components/booking/InsuranceSelection';
import BookingReview from '@/components/booking/BookingReview';
import SuccessModal from '@/components/booking/SuccessModal';

import {
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../../components/Layout/Header';
import Layout from '@/components/Layout/Layout';
import useAppStore from '@/store/useAppStore';
import HospitalCard from '@/components/booking/HospitalCard';
import toast from 'react-hot-toast';

const MedicalBooking = () => {
  // Step control
  const [currentStep, setCurrentStep] = useState(1);

  // State for user selections
  const [selectedDate, setSelectedDate] = useState(null);
  // const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  // Modal visibility
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { selectedHotel, selectedDateAndTime, selectedTravelManagement, selectedPlan, treatment, hospital, auth, setSelectedHotel } = useAppStore()


  const handleNextStep = () => {
    if(!auth || auth?.length==0){
      toast.error("please login to continue");
      return;
    }
    console.log("selected hotel is: ", selectedHotel);
    if (currentStep === 2 && !selectedHotel?._id) {
      console.log("selected hotel is: ", selectedHotel);      
     toast.error("Hotel Selection Skipped");
    }
     
    if(currentStep==1){
         if(!selectedDateAndTime || selectedDateAndTime.length==0){
           toast.error("please Confirm Date and Time");
           return;
         }
         else{
           toast.success("Treatment Schedule selected");
         }
    }

    if(currentStep==3){
        if(!(selectedTravelManagement?.travelMode)){
          toast.error("travel Management skipped");
        } else{
           toast.success("travel Management selected")
        }
    }

    if(currentStep==4){
         if(!(selectedPlan?.insurance_id)){
            toast.error("insurance not selected");
         } else{
            toast.success("insurance selected");
         }
    }

    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    if(currentStep===3){
        setSelectedHotel([]);
    }
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleConfirmBooking = () => {
    // Perform booking confirmation logic here (API calls, etc.)
    // Then show success modal
    setShowSuccessModal(true);
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mt-24 mx-auto px-4 py-8">
        {/* Stepper */}
        <Stepper currentStep={currentStep} />
        {/* <h1>
  hii {JSON.stringify(selectedDateAndTime)} {JSON.stringify(selectedHotel)}  {JSON.stringify(selectedTravelManagement)} {JSON.stringify(selectedPlan)}
</h1> */}


        {/* 
          We wrap our layout in a grid. Notice that if currentStep === 2,
          we make the main content area span all 3 columns (i.e., no sidebar).
        */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main content area - dynamically adjusts columns when there's no sidebar */}
          <div 
            className={`space-y-6 ${
              currentStep === 2 || currentStep === 5 ? 'lg:col-span-3' : 'lg:col-span-2'
            }`}
          >
            {/* Step 1: Choose Date */}
            {currentStep === 1 && (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 max-sm:text-xl max-sm:text-center">Choose Appointment Date</h2>
                <AppointmentCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </>
            )}

            {/* Step 2: Select Hotel */}
            {currentStep === 2 && (
              <>
                <h2 className="text-2xl font-semibold text-gray-900">Select Your Hotel</h2>
                <HotelSelection
                  handleNextStep= {handleNextStep}
                  // onSelect={(hotel) => setSelectedHotel(hotel)}
                />
              </>
            )}

            {/* Step 3: Travel Arrangements */}
            {currentStep === 3 && (
              <TravelSelection
                onFlightSelect={(flight) => setSelectedFlight(flight)}
                onTransportSelect={(transport) => setSelectedTransport(transport)}
              />
            )}

            {/* Step 4: Insurance Coverage */}
            {currentStep === 4 && (
              <InsuranceSelection
                onSelect={(plan) => setSelectedInsurance(plan)}
              />
            )}

            {/* Step 5: Review & Payment */}
            {currentStep === 5 && (
              <BookingReview
                treatment={treatment}
                hospital = {hospital}
                selectedDateAndTime = {selectedDateAndTime}
                hotel={selectedHotel}
                flight={selectedFlight}
                transport={selectedTransport}
                insurance={selectedInsurance}
                onConfirmBooking={handleConfirmBooking}
              />
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span>Back</span>
                </button>
              )}

              {currentStep < 5 && (
                <button
                  onClick={handleNextStep}
                  className="ml-auto flex items-center gap-2 px-6 py-2 bg-[#3252DF] text-white rounded-lg hover:bg-[#2341CE] transition-colors"
                >
                  {currentStep === 1 ? 'Select Hotel' : 'Next'}
                </button>
              )}
            </div>
          </div>

          {/* 
            Sidebar is visible for all steps EXCEPT step 2.
            We check: currentStep !== 2
          */}
          {currentStep !== 2 && currentStep!==5 && (
            <div className="lg:col-span-1">
              <TreatmentCard treatment={treatment}/>
              <HospitalCard hospital={hospital}/>

              {/* Contact and Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-white rounded-lg shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[#3252DF]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Call us at</p>
                      <p className="font-medium">+91 1800 123 4567</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#3252DF]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email support</p>
                      <p className="font-medium">support@arogini.com</p>
                    </div>
                  </div>
                </div>

                {/* Important Information */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#3252DF] mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Important Information</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Please arrive 15 minutes before your appointment</li>
                        <li>• Bring your medical history and reports</li>
                        <li>• Fasting may be required for some tests</li>
                        <li>• Free cancellation available up to 24 hours before appointment</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isVisible={showSuccessModal}
        selectedDate={selectedDate}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
    </Layout>
  );
};

export default MedicalBooking;
