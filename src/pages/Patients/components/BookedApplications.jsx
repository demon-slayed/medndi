import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Building2,
  MapPin,
  Calendar,
  Shield,
  Plane,
  Hotel,
  Stethoscope,
  X,
  ChevronRight,
  Info,
} from "lucide-react";
import useAppStore from "@/store/useAppStore";
import axios from "axios";
import ApplicationStatusStepper from "./ApplicationStatusStepper";
import { formatDateTime } from "@/components/booking/formatDateTime";
import { statusBadgeClass, statusLabel } from "@/lib/applicationStatus";

const formatINR = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const estimatedTotal = (application) =>
  (application?.treatment_id?.estimated_cost?.max || 0) +
  (application?.hotel_id?.price_per_night || 0) +
  (application?.insurance_id?.price || 0);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex shrink-0 items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(status)}`}
  >
    {statusLabel(status)}
  </span>
);

const DetailBlock = ({ icon: Icon, title, children, className = "" }) => (
  <div className={`bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm ${className}`}>
    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
      <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#3252DF]" />
      </span>
      {title}
    </h3>
    <div className="space-y-1 text-sm text-gray-600">{children}</div>
  </div>
);

const NotSelected = () => <p className="text-gray-500">Not selected</p>;

const BookedApplications = ({ applications: initialApplications }) => {
  const [applications, setApplications] = useState(initialApplications ?? []);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { auth } = useAppStore();

  useEffect(() => {
    // The dashboard passes applications in; only fetch when used standalone
    if (initialApplications) {
      setApplications(initialApplications);
      return;
    }
    const fetchApplicationsByUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/application/getByUserId/${
            auth?._id
          }`,
          {
            withCredentials: true,
          }
        );

        const data = res?.data;
        setApplications(Array.isArray(data) ? data : []);
        return data;
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        return [];
      }
    };

    fetchApplicationsByUser();
  }, [initialApplications, auth?._id]);

  // Close the detail sheet with Escape and stop the page behind it from scrolling
  useEffect(() => {
    if (!showDetailModal) return;
    const onKey = (e) => {
      if (e.key === "Escape") setShowDetailModal(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [showDetailModal]);

  const handleCardClick = (application) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
  };

  const formatDate = (value) => formatDateTime(value);

  if (applications.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">No bookings found</h3>
        <p className="mt-2 text-gray-600">Your treatment bookings will appear here.</p>
      </div>
    );
  }

  const app = selectedApplication;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {applications.map((application) => (
          <button
            type="button"
            key={application._id}
            className="group text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all p-5 sm:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40"
            onClick={() => handleCardClick(application)}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                {application.treatment_id?.treatment_name || "Treatment"}
              </h3>
              <StatusBadge status={application?.status} />
            </div>

            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#3252DF] shrink-0" />
                <span>{formatDate(application.treatmentdateandtime)}</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="w-4 h-4 text-[#3252DF] shrink-0" />
                <span className="truncate">
                  {application.hospital_id?.hospital_name || "Hospital"}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-end gap-3">
              <div>
                <p className="text-xs text-gray-500">Estimated total</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatINR(estimatedTotal(application))}
                </p>
              </div>
              <span className="flex items-center text-[#3252DF] text-sm font-medium group-hover:gap-1 transition-all">
                View details
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Detail sheet: full screen on phones, centred dialog from sm up */}
      <AnimatePresence>
        {showDetailModal && app && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[120] sm:p-4"
            onClick={closeDetailModal}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-detail-title"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-50 w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3 bg-white px-4 sm:px-6 py-4 border-b border-gray-100">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#3252DF]">
                    Booking details
                  </p>
                  <h2 id="booking-detail-title" className="mt-1 text-lg sm:text-xl font-bold text-gray-900 truncate">
                    {app.treatment_id?.treatment_name || "Treatment"}
                  </h2>
                  <div className="mt-2">
                    <StatusBadge status={app.status} />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeDetailModal}
                  aria-label="Close booking details"
                  className="p-2 rounded-full hover:bg-gray-100 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <Calendar className="w-5 h-5 text-[#3252DF] shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600">Appointment</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(app.treatmentdateandtime)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailBlock icon={Stethoscope} title="Treatment">
                    <p className="font-medium text-gray-900">{app.treatment_id?.treatment_name}</p>
                    {app.treatment_id?.duration && <p>Duration: {app.treatment_id.duration}</p>}
                    {app.treatment_id?.success_rate && <p>Success rate: {app.treatment_id.success_rate}</p>}
                    {app.treatment_id?.estimated_cost && (
                      <p className="font-medium text-gray-900 pt-1">
                        {formatINR(app.treatment_id.estimated_cost.min)} – {formatINR(app.treatment_id.estimated_cost.max)}
                      </p>
                    )}
                  </DetailBlock>

                  <DetailBlock icon={Building2} title="Hospital">
                    <p className="font-medium text-gray-900">{app.hospital_id?.hospital_name}</p>
                    {app.hospital_id?.rating != null && (
                      <p className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                        {app.hospital_id.rating}/5
                      </p>
                    )}
                    {app.hospital_id?.address && (
                      <p className="flex items-start gap-1">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                        {app.hospital_id.address}
                      </p>
                    )}
                  </DetailBlock>

                  <DetailBlock icon={Shield} title="Insurance">
                    {app.insurance_id?.name ? (
                      <>
                        <p className="font-medium text-gray-900">{app.insurance_id.name}</p>
                        {app.insurance_id?.features?.length > 0 && (
                          <ul className="list-disc list-inside">
                            {app.insurance_id.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        )}
                        {app.insurance_id?.price ? (
                          <p className="font-medium text-gray-900 pt-1">{formatINR(app.insurance_id.price)}</p>
                        ) : null}
                      </>
                    ) : (
                      <NotSelected />
                    )}
                  </DetailBlock>

                  <DetailBlock icon={Hotel} title="Accommodation">
                    {app.hotel_id?.hotel_name ? (
                      <>
                        <p className="font-medium text-gray-900">{app.hotel_id.hotel_name}</p>
                        {app.hotel_id?.distance && <p>{app.hotel_id.distance}</p>}
                        {app.hotel_id?.price_per_night ? (
                          <p className="font-medium text-gray-900 pt-1">
                            {formatINR(app.hotel_id.price_per_night)} per night
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <NotSelected />
                    )}
                  </DetailBlock>

                  <DetailBlock icon={Plane} title="Travel" className="md:col-span-2">
                    {app.travel_plan?.travelMode ? (
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                        <div className="flex gap-2"><dt className="text-gray-500">From:</dt><dd className="text-gray-900">{app.travel_plan?.sourceCity || "Not specified"}</dd></div>
                        <div className="flex gap-2"><dt className="text-gray-500">Mode:</dt><dd className="text-gray-900 capitalize">{app.travel_plan?.travelMode}</dd></div>
                        <div className="flex gap-2"><dt className="text-gray-500">To:</dt><dd className="text-gray-900">{app.travel_plan?.destinationCity || "Not specified"}</dd></div>
                        <div className="flex gap-2"><dt className="text-gray-500">Local transport:</dt><dd className="text-gray-900">{app.travel_plan?.selectedLocalTransport || "Not selected"}</dd></div>
                      </dl>
                    ) : (
                      <NotSelected />
                    )}
                  </DetailBlock>
                </div>

                {/* Cost Summary */}
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3">Cost summary</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-600">Treatment (estimated)</dt>
                      <dd className="font-medium text-gray-900">{formatINR(app.treatment_id?.estimated_cost?.max)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-600">Accommodation (per night)</dt>
                      <dd className="font-medium text-gray-900">
                        {app.hotel_id?.price_per_night != null ? formatINR(app.hotel_id.price_per_night) : <span className="text-gray-500 font-normal">Not selected</span>}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-600">Insurance</dt>
                      <dd className="font-medium text-gray-900">
                        {app.insurance_id?.price != null ? formatINR(app.insurance_id.price) : <span className="text-gray-500 font-normal">Not selected</span>}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-600">Travel</dt>
                      <dd className="text-right text-gray-900">
                        {app.travel_plan?.travelMode ? "Quoted after review" : <span className="text-gray-500">Not selected</span>}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-gray-100 pt-3 text-base">
                      <dt className="font-semibold text-gray-900">Estimated total</dt>
                      <dd className="font-bold text-[#3252DF]">{formatINR(estimatedTotal(app))} onwards</dd>
                    </div>
                  </dl>
                  <p className="mt-3 flex items-start gap-2 text-xs text-gray-500">
                    <Info className="w-4 h-4 shrink-0" />
                    No payment has been taken. Our care team confirms the final quote before any payment.
                  </p>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-900">Application progress</h3>
                  <p className="text-sm text-gray-500 mb-4">Estimated processing time: 7–10 business days</p>
                  <ApplicationStatusStepper currentStatus={app?.status} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookedApplications;
