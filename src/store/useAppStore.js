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
          auth
        } = state;
        return {
          treatment,
          hospital,
          auth
        };
      },
    }
  )
);

export default useAppStore;

