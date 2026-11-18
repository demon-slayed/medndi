import { useState } from "react";
import {
  Calendar,
  Stethoscope,
  Building2,
  Hotel,
  Plane,
  Shield,
  Pencil,
  Star,
  MapPin,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import useAppStore from "@/store/useAppStore";
import toast from "react-hot-toast";
import axios from "axios";
import { formatDateTime } from "./formatDateTime";
import { formatINR, getBookingEstimate } from "./bookingEstimate";

const Section = ({ icon: Icon, title, step, onEditStep, children }) => (
  <section className="rounded-xl border border-gray-200 p-4 sm:p-5">
    <div className="flex items-center justify-between gap-3 mb-3">
      <h3 className="flex items-center gap-2 font-semibold text-gray-900">
        <Icon className="w-5 h-5 text-[#3252DF]" />
        {title}
      </h3>
      {step && (
        <button
          type="button"
          onClick={() => onEditStep(step)}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#3252DF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 rounded"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
      )}
    </div>
    {children}
  </section>
);

const NotSelected = ({ children = "Not selected" }) => (
  <p className="text-gray-500">{children}</p>
);

const BookingReview = ({ onEditStep, onBooked }) => {
  const [submitting, setSubmitting] = useState(false);
  const {
    treatment,
    hospital,
    selectedHotel: hotel,
    selectedTravelManagement: travel,
    selectedDateAndTime,
    selectedPlan: plan,
  } = useAppStore();
  const estimate = getBookingEstimate({ treatment, hotel, plan });
  const hasHotel = Boolean(hotel?._id);
  const hasPlan = Boolean(plan?._id);
  const hasTravel = Boolean(travel?.travelMode);

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/application/create`,
        {
          treatment_id: treatment?._id,
          hospital_id: hospital?._id,
          hotel_id: hotel?._id,
          travel_plan: hasTravel ? travel : {},
          insurance_id: plan?._id,
          total_cost: estimate.totalMax,
          treatmentdateandtime: selectedDateAndTime,
        },
        { withCredentials: true }
      );

      toast.success("Booking request submitted");
      onBooked({
        applicationId: res.data?.data?.application_id ?? "",
        treatment,
        hospital,
        appointment: selectedDateAndTime,
        hotel: hasHotel ? hotel : null,
        plan: hasPlan ? plan : null,
        estimate,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not submit your booking. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Review your booking</h2>
        <p className="text-gray-600 mt-1">Check the details below. You can edit any part before confirming.</p>
      </div>

      <div className="space-y-4">
        <Section icon={Calendar} title="Appointment" step={1} onEditStep={onEditStep}>
          <p className="font-medium text-gray-900">{formatDateTime(selectedDateAndTime)}</p>
          <p className="text-sm text-gray-500">India Standard Time</p>
        </Section>

        <div className="grid md:grid-cols-2 gap-4">
          <Section icon={Stethoscope} title="Treatment">
            <p className="font-medium text-gray-900">{treatment?.treatment_name}</p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
              {treatment?.duration && <span>Hospital stay: {treatment.duration}</span>}
              {treatment?.success_rate && <span>Success rate: {treatment.success_rate}</span>}
            </div>
          </Section>

          <Section icon={Building2} title="Hospital">
            <p className="font-medium text-gray-900">{hospital?.hospital_name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
              {hospital?.rating != null && (
                <span className="inline-flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {hospital.rating}/5
                </span>
              )}
              {hospital?.accreditation && <span>{hospital.accreditation}</span>}
            </div>
            {hospital?.address && (
              <p className="mt-1 flex items-start gap-1 text-sm text-gray-500">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                {hospital.address}
              </p>
            )}
          </Section>

          <Section icon={Hotel} title="Hotel" step={2} onEditStep={onEditStep}>
            {hasHotel ? (
              <>
                <p className="font-medium text-gray-900">{hotel.hotel_name}</p>
                <p className="text-sm text-gray-600">
                  {[hotel.distance && `${hotel.distance} from hospital`, hotel.price_per_night != null && `${formatINR(hotel.price_per_night)} / night`]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </>
            ) : (
              <NotSelected>Skipped. Our team can help arrange a stay.</NotSelected>
            )}
          </Section>

          <Section icon={Plane} title="Travel" step={3} onEditStep={onEditStep}>
            {hasTravel ? (
              <>
                <p className="font-medium text-gray-900">
                  {[travel.sourceCity, travel.destinationCity].filter(Boolean).join(" → ") || "Travel arranged"}
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  {[travel.travelMode, travel.selectedLocalTransport].filter(Boolean).join(" · ")}
                </p>
              </>
            ) : (
              <NotSelected>Skipped. You&apos;ll arrange your own travel.</NotSelected>
            )}
          </Section>
        </div>

        <Section icon={Shield} title="Insurance" step={4} onEditStep={onEditStep}>
          {hasPlan ? (
            <>
              <p className="font-medium text-gray-900">{plan.name}</p>
              {plan.features?.length > 0 && (
                <ul className="mt-1 grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600 list-disc list-inside">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <NotSelected>No travel insurance added.</NotSelected>
          )}
        </Section>

        {/* Cost breakdown */}
        <section className="rounded-xl bg-gray-50 border border-gray-200 p-4 sm:p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Estimated cost</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-600">Treatment</dt>
              <dd className="font-medium text-gray-900 text-right">
                {formatINR(estimate.treatmentMin)} – {formatINR(estimate.treatmentMax)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-600">
                Hotel
                {hasHotel && estimate.nightlyRate != null && (
                  <span className="text-gray-400">
                    {" "}({formatINR(estimate.nightlyRate)} × {estimate.nights ?? 1} night{(estimate.nights ?? 1) > 1 ? "s" : ""}
                    {estimate.nights ? ", est." : ""})
                  </span>
                )}
              </dt>
              <dd className="font-medium text-gray-900 text-right">{hasHotel ? formatINR(estimate.hotelTotal) : "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-600">Insurance</dt>
              <dd className="font-medium text-gray-900 text-right">{hasPlan ? formatINR(estimate.insurance) : "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-600">Travel</dt>
              <dd className="text-gray-500 text-right">{hasTravel ? "Quoted after review" : "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-gray-200 pt-3 text-base">
              <dt className="font-semibold text-gray-900">Estimated total</dt>
              <dd className="font-bold text-[#3252DF] text-right">
                {formatINR(estimate.totalMin)} – {formatINR(estimate.totalMax)}
              </dd>
            </div>
          </dl>
        </section>

        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <ShieldCheck className="w-5 h-5 text-[#3252DF] mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-gray-900">No payment needed now</p>
            <p className="text-sm text-gray-600">
              Our care team reviews your request and confirms the final quote with you before any payment.
              By confirming, you agree to our Terms &amp; Conditions.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
        <button
          type="button"
          onClick={() => onEditStep(4)}
          disabled={submitting}
          className="py-3 px-6 border-2 border-gray-200 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 disabled:opacity-60"
        >
          Back
        </button>
        <button
          type="button"
          className="py-3 px-8 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2 disabled:opacity-60 flex items-center justify-center gap-2"
          onClick={handleConfirm}
          disabled={submitting}
        >
          {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
          {submitting ? "Submitting..." : "Confirm booking request"}
        </button>
      </div>
    </div>
  );
};

export default BookingReview;
