import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Stepper from '@/components/booking/Stepper';
import AppointmentCalendar from '@/components/booking/AppointmentCalendar';
import HotelSelection from '@/components/booking/HotelSelection';
import TravelSelection from '@/components/booking/TravelSelection';
import InsuranceSelection from '@/components/booking/InsuranceSelection';
import BookingReview from '@/components/booking/BookingReview';
import BookingSummary from '@/components/booking/BookingSummary';
import BookingConfirmation from '@/components/booking/BookingConfirmation';

import {
  Phone,
  Mail,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout/Layout';
import useAppStore from '@/store/useAppStore';
import toast from 'react-hot-toast';

const MedicalBooking = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const {
    treatment, hospital,
    selectedHotel, selectedTravelManagement, selectedPlan,
    setSelectedHotel, setSelectedDateAndTime, setSelectedTravelManagement, setSelectedPlan,
    bookingKey, setBookingKey, bookingStep: currentStep, setBookingStep,
  } = useAppStore()

  const hospitalIds = (treatment?.available_hospitals ?? []).map((h) => h?._id ?? h);
  const hasSelection = Boolean(treatment?._id && hospital?._id);
  const hospitalOffersTreatment = !hasSelection || hospitalIds.length === 0 || hospitalIds.includes(hospital._id);
  const currentKey = hasSelection ? `${treatment._id}:${hospital._id}` : "";

  const resetSelections = () => {
    setSelectedHotel([]);
    setSelectedDateAndTime([]);
    setSelectedTravelManagement([]);
    setSelectedPlan([]);
  };

  // Resume a booking in progress after a refresh; start fresh for a different treatment or hospital
  useEffect(() => {
    if (!currentKey) return;
    const { selectedDateAndTime } = useAppStore.getState();
    const appointmentInPast =
      typeof selectedDateAndTime === "string" && new Date(selectedDateAndTime) < new Date();
    if (bookingKey !== currentKey || appointmentInPast) {
      resetSelections();
      setBookingKey(currentKey);
      setBookingStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey]);

  const goToStep = (step) => {
    setBookingStep(Math.min(Math.max(step, 1), 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextStep = () => {
    // Read the latest selections: child steps update the store right before calling this
    const { selectedDateAndTime } = useAppStore.getState();
    if (currentStep === 1 && (!selectedDateAndTime || selectedDateAndTime.length === 0)) {
      toast.error("Please confirm a date and time");
      return;
    }
    goToStep(currentStep + 1);
  };

  const handlePrevStep = () => goToStep(currentStep - 1);

  const handleBooked = (booking) => {
    resetSelections();
    setBookingKey("");
    setBookingStep(1);
    setConfirmedBooking(booking);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Optional steps say "Skip" until something is chosen
  const stepHasChoice = {
    2: Boolean(selectedHotel?._id),
    3: Boolean(selectedTravelManagement?.travelMode),
    4: Boolean(selectedPlan?._id),
  };
  const nextLabel =
    currentStep === 1 ? 'Continue' : stepHasChoice[currentStep] ? 'Continue' : 'Skip this step';

  if (confirmedBooking) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
            <BookingConfirmation booking={confirmedBooking} />
          </div>
        </div>
      </Layout>
    );
  }

  if (!hasSelection || !hospitalOffersTreatment) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
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
              className="mt-6 inline-block px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
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
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        <PageHeader
          eyebrow="Book your treatment"
          title={treatment?.treatment_name || "Book your treatment"}
          subtitle={hospital?.hospital_name ? `at ${hospital.hospital_name}` : undefined}
        />

        {/* Stepper */}
        <Stepper currentStep={currentStep} onStepClick={goToStep} />

        {/* Compact summary on phones and tablets; the sidebar takes over on large screens */}
        {currentStep < 5 && (
          <details className="lg:hidden mb-6 group rounded-2xl bg-white border border-gray-100 shadow-sm">
            <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-4 py-3 font-medium text-gray-900">
              Booking summary
              <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-open:rotate-180" />
            </summary>
            <BookingSummary currentStep={currentStep} onEditStep={goToStep} className="shadow-none border-0 rounded-t-none pt-0" />
          </details>
        )}


        {/* 
          We wrap our layout in a grid. Notice that if currentStep === 2,
          we make the main content area span all 3 columns (i.e., no sidebar).
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Main content area - dynamically adjusts columns when there's no sidebar */}
          <div 
            className={`space-y-6 ${
              currentStep === 2 || currentStep === 5 ? 'lg:col-span-3' : 'lg:col-span-2'
            }`}
          >
            {/* Step 1: Choose Date */}
            {currentStep === 1 && (
              <>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Choose appointment date</h2>
                <AppointmentCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </>
            )}

            {/* Step 2: Select Hotel */}
            {currentStep === 2 && (
              <>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Select your hotel</h2>
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
              <BookingReview onEditStep={goToStep} onBooked={handleBooked} />
            )}

            {/* Navigation buttons */}
            {currentStep < 5 && (
            <div className="flex justify-between gap-3 mt-8">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="flex items-center gap-2 px-6 py-2.5 border-2 border-gray-200 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}

              {currentStep < 5 && (
                <button
                  onClick={handleNextStep}
                  className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
                >
                  {nextLabel}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
            )}
          </div>

          {/* 
            Sidebar is visible for all steps EXCEPT step 2.
            We check: currentStep !== 2
          */}
          {currentStep !== 2 && currentStep!==5 && (
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-32 space-y-6">
              <BookingSummary currentStep={currentStep} onEditStep={goToStep} />

              {/* Contact and Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[#3252DF]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Call us at</p>
                      <a href="tel:+9118001234567" className="font-medium hover:text-[#3252DF]">+91 1800 123 4567</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#3252DF]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email support</p>
                      <a href="mailto:info@medndi.com" className="font-medium hover:text-[#3252DF]">info@medndi.com</a>
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
            </div>
          )}
        </div>
      </div>

    </div>
    </Layout>
  );
};

export default MedicalBooking;
