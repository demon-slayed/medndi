import { Calendar, Hotel, Plane, Shield, Stethoscope, Pencil } from "lucide-react";
import useAppStore from "@/store/useAppStore";
import { formatDateTime } from "./formatDateTime";
import { formatINR, getBookingEstimate } from "./bookingEstimate";

// Running summary of the booking so far; each row can jump back to its step.
const BookingSummary = ({ currentStep, onEditStep, className = "" }) => {
  const {
    treatment,
    hospital,
    selectedDateAndTime,
    selectedHotel,
    selectedTravelManagement,
    selectedPlan,
  } = useAppStore();
  const estimate = getBookingEstimate({ treatment, hotel: selectedHotel, plan: selectedPlan });

  const rows = [
    {
      step: 1,
      icon: Calendar,
      label: "Appointment",
      value: selectedDateAndTime?.length ? formatDateTime(selectedDateAndTime) : null,
    },
    {
      step: 2,
      icon: Hotel,
      label: "Hotel",
      value: selectedHotel?.hotel_name,
      detail: selectedHotel?.price_per_night != null ? `${formatINR(selectedHotel.price_per_night)} / night` : null,
    },
    {
      step: 3,
      icon: Plane,
      label: "Travel",
      value: selectedTravelManagement?.travelMode
        ? [selectedTravelManagement.sourceCity, selectedTravelManagement.destinationCity].filter(Boolean).join(" → ") ||
          selectedTravelManagement.travelMode
        : null,
      detail: selectedTravelManagement?.travelMode,
    },
    {
      step: 4,
      icon: Shield,
      label: "Insurance",
      value: selectedPlan?.name,
      detail: selectedPlan?.price != null ? formatINR(selectedPlan.price) : null,
    },
  ];

  return (
    <aside className={`bg-white rounded-2xl border border-gray-100 shadow-lg p-5 sm:p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">Your booking</h3>

      <div className="mt-4 flex items-start gap-3 rounded-xl bg-blue-50 p-3">
        <Stethoscope className="w-5 h-5 text-[#3252DF] mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="font-medium text-gray-900 truncate">{treatment?.treatment_name}</p>
          <p className="text-sm text-gray-600 truncate">{hospital?.hospital_name}</p>
        </div>
      </div>

      <ul className="mt-4 divide-y divide-gray-100">
        {rows.map(({ step, icon: Icon, label, value, detail }) => {
          const reachable = step < currentStep;
          return (
            <li key={step} className="flex items-start gap-3 py-3">
              <Icon className={`w-4 h-4 mt-1 shrink-0 ${value ? "text-[#3252DF]" : "text-gray-300"}`} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
                <p className={`text-sm truncate ${value ? "text-gray-900" : "text-gray-400"}`}>
                  {value || (step < currentStep ? "Skipped" : "Not chosen yet")}
                </p>
                {value && detail && <p className="text-xs text-gray-500 capitalize truncate">{detail}</p>}
              </div>
              {reachable && (
                <button
                  type="button"
                  onClick={() => onEditStep(step)}
                  className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-[#3252DF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 rounded"
                  aria-label={`Edit ${label.toLowerCase()}`}
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-2 border-t border-gray-100 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-gray-600">Estimated total</span>
          <span className="text-lg font-bold text-[#3252DF] text-right">
            {formatINR(estimate.totalMin)}
            {estimate.totalMax > estimate.totalMin && (
              <span className="block text-xs font-medium text-gray-500">up to {formatINR(estimate.totalMax)}</span>
            )}
          </span>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          No payment now. Our care team confirms the final quote.
        </p>
      </div>
    </aside>
  );
};

export default BookingSummary;
