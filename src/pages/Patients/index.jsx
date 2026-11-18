import { motion } from "framer-motion";
import {
  CalendarPlus,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  HeartPulse,
  Mail,
  Phone,
  Search,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout/Layout";
import PageHeader from "@/components/PageHeader";
import { useNavigate } from "react-router-dom";
import BookedApplications from "./components/BookedApplications";
import { useState, useEffect } from "react";
import axios from "axios";
import useAppStore from "@/store/useAppStore";
import PostCareRequestForm from "./components/PostCareRequestForm";
import { statusLabel } from "@/lib/applicationStatus";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const guidelines = [
  {
    title: "Before you travel",
    dot: "bg-[#3252DF]",
    items: [
      "Document verification takes 24–48 hours",
      "Keep your medical records and reports ready",
      "Stay reachable for follow-up calls from your coordinator",
    ],
  },
  {
    title: "Payments & billing",
    dot: "bg-green-500",
    items: [
      "No payment is taken until your final quote is confirmed",
      "Hospital bills are settled directly before discharge",
      "Extended stays may add to the estimate",
    ],
  },
  {
    title: "Travel & stay",
    dot: "bg-amber-500",
    items: [
      "Plan travel within 3–5 days of approval",
      "Stay close to the hospital for follow-ups",
      "Check your passport and medical visa validity",
    ],
  },
];

const StatCard = ({ icon: Icon, label, value, tone }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
    </div>
    <div className="min-w-0">
      <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{value}</p>
      <p className="text-xs sm:text-sm text-gray-600">{label}</p>
    </div>
  </div>
);

export default function PatientDashboard() {
  const [application, setApplication] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeTab, setActiveTab] = useState("application");
  const { auth } = useAppStore();

  useEffect(() => {
    const fetchApplicationsByUser = async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/application/getByUserId/${
            auth?._id
          }`,
          {
            withCredentials: true,
          }
        );

        setApplication(Array.isArray(res?.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationsByUser();
  }, [auth?._id]);

  const navigate = useNavigate();

  const firstName =
    auth?.fullName?.trim()?.split(/\s+/)[0] || auth?.email?.split("@")[0] || "there";
  const approvedCount = application.filter((a) => a?.status === "approved").length;
  const inProgressCount = application.filter(
    (a) => a?.status && !["approved", "rejected"].includes(a.status)
  ).length;
  // The API returns bookings newest first
  const latest = application[0];

  const summary = loading
    ? "Loading your bookings…"
    : loadError
    ? "Here's your MedNdi dashboard."
    : application.length === 0
    ? "You don't have any bookings yet. Find a treatment to get started."
    : `You have ${application.length} ${application.length === 1 ? "booking" : "bookings"}. Latest: ${
        latest?.treatment_id?.treatment_name || "Treatment"
      } — ${statusLabel(latest?.status)}.`;

  const goToPostCare = () => {
    setActiveTab("postcare");
    document.getElementById("dashboard-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const quickActions = [
    { label: "Book a treatment", icon: Search, onClick: () => navigate("/treatments"), primary: true },
    { label: "Analyse a report", icon: FileText, onClick: () => navigate("/patient/query") },
    { label: "Request post-care", icon: HeartPulse, onClick: goToPostCare },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <motion.div {...fadeIn}>
            <PageHeader
              eyebrow="My dashboard"
              title={`Welcome back, ${firstName}`}
              subtitle={summary}
            />
          </motion.div>

          {/* Quick actions */}
          <motion.div {...fadeIn} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {quickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className={`group flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2 ${
                  action.primary
                    ? "bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white shadow-sm hover:shadow-lg hover:shadow-blue-500/25"
                    : "bg-white text-gray-900 border border-gray-100 shadow-sm hover:border-[#3252DF]/30 hover:shadow-md"
                }`}
              >
                <span className="flex items-center gap-3">
                  <action.icon className={`w-5 h-5 ${action.primary ? "text-white" : "text-[#3252DF]"}`} />
                  {action.label}
                </span>
                <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${action.primary ? "text-white" : "text-gray-400"}`} />
              </button>
            ))}
          </motion.div>

          {/* Summary stats */}
          {!loading && !loadError && application.length > 0 && (
            <motion.div {...fadeIn} className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
              <StatCard icon={ClipboardList} label="Bookings" value={application.length} tone="bg-blue-50 text-[#3252DF]" />
              <StatCard icon={Clock} label="In progress" value={inProgressCount} tone="bg-amber-50 text-amber-600" />
              <StatCard icon={CheckCircle2} label="Approved" value={approvedCount} tone="bg-green-50 text-green-600" />
            </motion.div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full scroll-mt-32" id="dashboard-tabs">
            <TabsList className="sm:w-auto sm:inline-flex">
              <TabsTrigger value="application">
                <ClipboardList />
                My bookings
              </TabsTrigger>
              <TabsTrigger value="postcare">
                <HeartPulse />
                Post-care support
              </TabsTrigger>
            </TabsList>

            <TabsContent value="application">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="animate-pulse bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                      <div className="flex justify-between gap-4">
                        <div className="h-5 bg-gray-200 rounded w-2/3" />
                        <div className="h-5 bg-gray-200 rounded-full w-20" />
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-8 bg-gray-100 rounded w-1/3 mt-6" />
                    </div>
                  ))}
                </div>
              ) : loadError ? (
                <div className="text-center py-16 px-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900">
                    We couldn&apos;t load your bookings
                  </h2>
                  <p className="text-gray-600 mt-2">Please check your connection and try again.</p>
                  <Button variant="brand" className="mt-6" onClick={() => window.location.reload()}>
                    Try again
                  </Button>
                </div>
              ) : application.length > 0 ? (
                <>
                  <BookedApplications applications={application} />
                  <div className="mt-10">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Good to know</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                      {guidelines.map((group) => (
                        <div key={group.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                          <h3 className="font-semibold text-gray-900 mb-3">{group.title}</h3>
                          <ul className="space-y-3 text-sm text-gray-600">
                            {group.items.map((item) => (
                              <li key={item} className="flex items-start gap-2">
                                <span className={`w-1.5 h-1.5 mt-2 rounded-full shrink-0 ${group.dot}`} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                    <CalendarPlus className="w-8 h-8 text-[#3252DF]" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900">
                    Your bookings will show here
                  </h2>
                  <p className="mt-2 text-gray-600 max-w-md">
                    Once you complete a treatment booking, its progress and
                    details will appear in this section.
                  </p>
                  <Button variant="brand" className="mt-6" onClick={() => navigate("/treatments")}>
                    Browse treatments
                  </Button>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="postcare">
              <PostCareRequestForm />
            </TabsContent>
          </Tabs>

          {/* Support */}
          <motion.div
            {...fadeIn}
            className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Need help with your booking?</h2>
              <p className="text-sm text-gray-600 mt-1">
                Your MedNdi care coordinator is available 24/7.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+9118001234567"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-[#3252DF] text-[#3252DF] font-medium hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40"
              >
                <Phone className="w-4 h-4" />
                +91 1800 123 4567
              </a>
              <a
                href="mailto:care@medndi.com"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
              >
                <Mail className="w-4 h-4" />
                care@medndi.com
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
