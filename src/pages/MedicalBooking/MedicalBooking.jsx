import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Stepper from '@/components/booking/Stepper';
import AppointmentCalendar from '@/components/booking/AppointmentCalendar';
import TreatmentCard from '@/components/booking/TreatmentCard';
import HotelSelection from '@/components/booking/HotelSelection';
import TravelSelection from '@/components/booking/TravelSelection';
import InsuranceSelection from '@/components/booking/InsuranceSelection';
import BookingReview from '@/components/booking/BookingReview';

import {
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout/Layout';
import useAppStore from '@/store/useAppStore';
import HospitalCard from '@/components/booking/HospitalCard';
import toast from 'react-hot-toast';

const MedicalBooking = () => {
  // Step control
  const [currentStep, setCurrentStep] = useState(1);

  const [selectedDate, setSelectedDate] = useState(null);

  const {
    treatment, hospital,
    setSelectedHotel, setSelectedDateAndTime, setSelectedTravelManagement, setSelectedPlan,
  } = useAppStore()

  // Start every booking fresh so selections from an earlier booking don't leak in
  useEffect(() => {
    setSelectedHotel([]);
    setSelectedDateAndTime([]);
    setSelectedTravelManagement([]);
    setSelectedPlan([]);
  }, [setSelectedHotel, setSelectedDateAndTime, setSelectedTravelManagement, setSelectedPlan]);

  const hospitalIds = (treatment?.available_hospitals ?? []).map((h) => h?._id ?? h);
  const hasSelection = Boolean(treatment?._id && hospital?._id);
  const hospitalOffersTreatment = !hasSelection || hospitalIds.length === 0 || hospitalIds.includes(hospital._id);

  const handleNextStep = () => {
    // Read the latest selections: child steps update the store right before calling this
    const { selectedHotel, selectedDateAndTime, selectedTravelManagement, selectedPlan } = useAppStore.getState();
    if (currentStep === 2 && !selectedHotel?._id) {
     toast("Hotel selection skipped");
    }
     
    if(currentStep==1){
         if(!selectedDateAndTime || selectedDateAndTime.length==0){
           toast.error("Please confirm a date and time");
           return;
         }
    }

    if(currentStep==3){
        if(!(selectedTravelManagement?.travelMode)){
          toast("Travel arrangements skipped");
        }
    }

    if(currentStep==4){
         if(!(selectedPlan?.insurance_id)){
            toast("Insurance skipped");
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

  if (!hasSelection || !hospitalOffersTreatment) {
    return (
      <Layout>
        <div className="min-h-[60vh] mt-28 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <AlertCircle className="w-10 h-10 text-[#3252DF] mx-auto" />
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
              {hasSelection ? 'Choose a hospital for this treatment' : 'Choose a treatment first'}
            </h1>
            <p className="mt-2 text-gray-600">
              {hasSelection
                ? `${hospital.hospital_name} doesn't offer ${treatment.treatment_name}. Pick one of the hospitals that does.`
                : 'Pick a treatment and a hospital, then book from there.'}
            </p>
            <Link
              to={hasSelection ? `/treatment-details/${treatment.treatment_id}` : '/treatments'}
              className="mt-6 inline-block px-6 py-2.5 rounded-lg bg-[#3252DF] text-white font-medium hover:bg-[#2341CE]"
            >
              {hasSelection ? 'See hospitals' : 'Browse treatments'}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

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
              <TravelSelection />
            )}

            {/* Step 4: Insurance Coverage */}
            {currentStep === 4 && (
              <InsuranceSelection />
            )}

            {/* Step 5: Review & Payment */}
            {currentStep === 5 && (
              <BookingReview onEditBooking={() => setCurrentStep(1)} />
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
                      <p className="font-medium">support@medndi.com</p>
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

    </div>
    </Layout>
  );
};

export default MedicalBooking;
