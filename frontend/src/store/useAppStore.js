import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set) => ({
      //auth
      auth: [],
      setAuth: (auth) => set({ auth }),

      // Treatment
      treatment: [],
      setTreatment: (treatment) => set({ treatment }),
      
      // Hospital
      hospital: [],
      setHospital: (hospital) => set({ hospital }),

      // Time
      selectedDateAndTime: [],
      setSelectedDateAndTime: (selectedDateAndTime) => set({ selectedDateAndTime }),      

      // Insurance
      insurance: [],
      setInsurance: (insurance) => set({ insurance }),

      // travel management
      selectedTravelManagement: [],
      setSelectedTravelManagement: (selectedTravelManagement) => set({ selectedTravelManagement }),

      // insurance plan
      selectedPlan: [],
      setSelectedPlan: (selectedPlan) => set({ selectedPlan }),

      // Hotel
      selectedHotel: [],
      setSelectedHotel: (selectedHotel) => set({ selectedHotel }),

      // Booking in progress: which treatment+hospital it's for and the step reached,
      // so a refresh mid-booking resumes instead of starting over
      bookingKey: "",
      setBookingKey: (bookingKey) => set({ bookingKey }),
      bookingStep: 1,
      setBookingStep: (bookingStep) => set({ bookingStep }),

      //url
      redirectPath:"",
      setRedirectPath: (redirectPath) => set({ redirectPath }),
    }),
    {
      name: 'app-storage', // localStorage key
      partialize: (state) => {
        // return only the keys you want to persist
        const {
          treatment,
          hospital,
          auth,
          selectedDateAndTime,
          selectedHotel,
          selectedTravelManagement,
          selectedPlan,
          bookingKey,
          bookingStep,
          redirectPath,
        } = state;
        return {
          treatment,
          hospital,
          auth,
          selectedDateAndTime,
          selectedHotel,
          selectedTravelManagement,
          selectedPlan,
          bookingKey,
          bookingStep,
          redirectPath,
        };
      },
    }
  )
);

export default useAppStore;

