import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, ClipboardList, FileSearch, Printer, Phone, Mail } from "lucide-react";
import { formatDateTime } from "./formatDateTime";
import { formatINR } from "./bookingEstimate";

// Mirrors the application statuses the care team moves a booking through
const NEXT_STEPS = [
  { title: "Initial assessment", description: "A care coordinator reviews your request, usually within 24 hours." },
  { title: "Document verification", description: "We may ask for recent reports, prescriptions and ID." },
  { title: "Medical board review", description: "The hospital's specialists confirm the treatment plan and quote." },
  { title: "Travel & stay", description: "We help with visa letters, travel and your hotel booking." },
];

const BookingConfirmation = ({ booking }) => {
  const { applicationId, treatment, hospital, appointment, hotel, plan, estimate } = booking;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
        </div>
        <h2 className="mt-5 text-2xl sm:text-3xl font-bold text-gray-900">Booking request submitted</h2>
        <p className="mt-2 text-gray-600">
          Thank you. Our care team will review your request and keep you updated from your dashboard.
        </p>
        {applicationId && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm">
            <span className="text-gray-600">Booking ID</span>
            <span className="font-semibold text-[#3252DF] tracking-wide">{applicationId}</span>
          </p>
        )}

        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {[
            ["Treatment", treatment?.treatment_name],
            ["Hospital", hospital?.hospital_name],
            ["Appointment", formatDateTime(appointment)],
            ["Hotel", hotel?.hotel_name || "Not selected"],
            ["Insurance", plan?.name || "Not selected"],
            [
              "Estimated total",
              estimate.totalMax > estimate.totalMin
                ? `${formatINR(estimate.totalMin)} – ${formatINR(estimate.totalMax)}`
                : formatINR(estimate.totalMin),
            ],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-gray-50 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
              <dd className="mt-0.5 font-medium text-gray-900 break-words">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 print:hidden">
          <Link
            to="/patient"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
          >
            <ClipboardList className="w-5 h-5" />
            View my booking
          </Link>
          <Link
            to="/patient/query"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-lg border-2 border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40"
          >
            <FileSearch className="w-5 h-5" />
            Analyse a medical report
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-lg border-2 border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40"
          >
            <Printer className="w-5 h-5" />
            Print
          </button>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-gray-900">What happens next</h3>
        <ol className="mt-4 space-y-4">
          {NEXT_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span
                className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index === 0 ? "bg-[#3252DF] text-white" : "bg-blue-50 text-[#3252DF]"
                }`}
              >
                {index + 1}
              </span>
              <div>
                <p className="font-medium text-gray-900">{step.title}</p>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-6 border-t border-gray-100 pt-4 text-sm text-gray-600">
          <a href="tel:+9118001234567" className="inline-flex items-center gap-2 hover:text-[#3252DF]">
            <Phone className="w-4 h-4 text-[#3252DF]" />
            +91 1800 123 4567
          </a>
          <a href="mailto:info@medndi.com" className="inline-flex items-center gap-2 hover:text-[#3252DF]">
            <Mail className="w-4 h-4 text-[#3252DF]" />
            info@medndi.com
          </a>
        </div>
      </div>
    </motion.section>
  );
};

export default BookingConfirmation;
