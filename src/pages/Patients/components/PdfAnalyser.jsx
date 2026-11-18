// src/components/PdfAnalyzer.jsx
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import {
  FileText,
  Upload,
  X,
  AlertTriangle,
  AlertCircle,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Activity,
  Info,
  ClipboardList,
  Loader2,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import PageHeader from "@/components/PageHeader";

// Create a theme with medical-appropriate colors
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#1976d2", // Blue shade
//     },
//     secondary: {
//       main: "#7c4dff", // Purple shade
//     },
//     error: {
//       main: "#d32f2f", // Red shade
//     },
//     warning: {
//       main: "#ed6c02", // Orange shade
//     },
//     info: {
//       main: "#0288d1", // Light blue shade
//     },
//     success: {
//       main: "#2e7d32", // Green shade
//     },
//     background: {
//       default: "#f5f5f5",
//       paper: "#ffffff",
//     },
//   },
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     h4: {
//       fontWeight: 600,
//     },
//     h5: {
//       fontWeight: 500,
//     },
//     h6: {
//       fontWeight: 500,
//     },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           textTransform: "none",
//           fontWeight: 500,
//         },
//         contained: {
//           boxShadow: "none",
//           "&:hover": {
//             boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
//           },
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//           boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//         },
//         elevation3: {
//           boxShadow: "0px 3px 10px rgba(0,0,0,0.08)",
//         },
//       },
//     },
//     MuiDivider: {
//       styleOverrides: {
//         root: {
//           backgroundColor: "rgba(0, 0, 0, 0.09)",
//         },
//       },
//     },
//     MuiListItem: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           "&:hover": {
//             backgroundColor: "rgba(25, 118, 210, 0.04)",
//           },
//         },
//       },
//     },
//   },
// });

const PdfAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [storeFile, setStoreFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else if (selectedFile) {
      setFile(null);
      setError("Please select a PDF file");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError("");
      } else {
        setError("Please drop a PDF file");
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("pdfFile", file);
    formData.append("storeFile", storeFile.toString());

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/gemini/analyze-pdf`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success && response.data.analysis?.error) {
        setError("We couldn't interpret this document. Please try a different PDF.");
      } else if (response.data.success) {
        setAnalysis(response.data);
        setOpenSnackbar(true);
      } else {
        setError(response.data.message || "Error analyzing PDF");
      }
    } catch (err) {
      const status = err.response?.status;
      if (!err.response) {
        setError("Can't reach the server. Please check your connection and try again.");
      } else if (status === 401) {
        setError("Your session has expired. Please sign in again.");
      } else if (status >= 500) {
        setError("The report analysis service is unavailable right now. Please try again later.");
      } else {
        setError(err.response?.data?.message || "Error analyzing PDF");
      }
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setFile(null);
    setAnalysis(null);
    setError("");
    // Reset file input by clearing the value
    const fileInput = document.getElementById("pdf-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const resultSections = analysis
    ? [
        {
          title: "Potential conditions",
          icon: AlertTriangle,
          tone: "bg-red-50 text-red-700",
          dot: "bg-red-400",
          items: analysis.analysis?.potentialConditions,
          empty: "No conditions identified",
        },
        {
          title: "Key symptoms",
          icon: Activity,
          tone: "bg-blue-50 text-[#3252DF]",
          dot: "bg-[#3252DF]",
          items: analysis.analysis?.keySymptoms,
          empty: "No key symptoms identified",
        },
        {
          title: "Concerning factors",
          icon: AlertCircle,
          tone: "bg-amber-50 text-amber-700",
          dot: "bg-amber-400",
          items: analysis.analysis?.concerningFactors,
          empty: "No concerning factors identified",
        },
        {
          title: "Related information",
          icon: Info,
          tone: "bg-indigo-50 text-indigo-700",
          dot: "bg-indigo-400",
          items: analysis.analysis?.relatedInfo,
          empty: "No related information available",
        },
      ]
    : [];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <PageHeader
            eyebrow="Patient tools"
            title="Medical report analyser"
            subtitle="Upload a medical report (PDF) and get a plain-language summary of the key findings to discuss with your doctor."
            actions={
              <Link
                to="/patient"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#3252DF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 rounded"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </Link>
            }
          />

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-8 mb-8">
            <form onSubmit={handleSubmit}>
              <div
                className={`p-6 sm:p-10 border-2 border-dashed rounded-2xl text-center transition-colors duration-200 ${
                  file
                    ? "border-[#3252DF]/50 bg-blue-50/60"
                    : "border-gray-200 bg-gray-50/60 hover:border-[#3252DF]/50 hover:bg-blue-50/40"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  id="pdf-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="sr-only peer"
                />

                <div className="flex flex-col items-center justify-center gap-4">
                  <div
                    className={`h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center ${
                      file ? "bg-blue-100 text-[#3252DF]" : "bg-white text-gray-400 shadow-sm"
                    }`}
                  >
                    {file ? <FileCheck className="h-8 w-8 sm:h-10 sm:w-10" /> : <Upload className="h-8 w-8 sm:h-10 sm:w-10" />}
                  </div>

                  {!file ? (
                    <>
                      <label
                        htmlFor="pdf-upload"
                        className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-lg cursor-pointer shadow-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-[#3252DF]/40 peer-focus-visible:ring-offset-2"
                      >
                        Select PDF file
                      </label>
                      <p className="text-sm text-gray-500 hidden sm:block">or drag and drop it here</p>
                      <p className="text-xs text-gray-500">PDF only, up to 10 MB</p>
                    </>
                  ) : (
                    <div className="w-full max-w-md">
                      <div className="flex items-center gap-3 p-3 sm:p-4 bg-white border border-gray-100 rounded-xl shadow-sm text-left">
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-[#3252DF]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={clearResults}
                          aria-label="Remove file"
                          className="shrink-0 text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <label
                        htmlFor="pdf-upload"
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#3252DF] hover:underline cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        Choose a different file
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div role="alert" className="mt-5 bg-red-50 text-red-700 p-4 rounded-xl text-sm flex items-start gap-2 border border-red-200">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
                  <p>{error}</p>
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-xs text-gray-500 flex items-start gap-2 sm:max-w-md">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-gray-400" />
                  This summary is for information only and is not a medical diagnosis.
                </p>
                <button
                  type="submit"
                  disabled={loading || !file}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all bg-gradient-to-r from-[#3252DF] to-[#4466ff] shadow-sm hover:shadow-lg hover:shadow-blue-500/25 disabled:from-gray-300 disabled:to-gray-300 disabled:shadow-none disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analysing...
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5" />
                      Analyse report
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-8 mb-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 mb-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ClipboardList className="h-6 w-6 text-[#3252DF]" />
                  Analysis results
                </h2>
                <div className="sm:text-right min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{analysis.fileName}</p>
                  <p className="text-xs text-gray-500">
                    {analysis.fileStored ? "Stored on server" : "Deleted after processing"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {resultSections.map((section) => (
                  <div key={section.title} className="rounded-xl border border-gray-100 overflow-hidden">
                    <div className={`px-4 py-3 flex items-center gap-2 font-medium ${section.tone}`}>
                      <section.icon className="h-5 w-5" />
                      {section.title}
                    </div>
                    <div className="p-4">
                      {section.items?.length > 0 ? (
                        <ul className="space-y-2">
                          {section.items.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                              <span className={`h-1.5 w-1.5 mt-2 rounded-full shrink-0 ${section.dot}`} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">{section.empty}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={clearResults}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border-2 border-[#3252DF] text-[#3252DF] font-medium hover:bg-blue-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40"
                >
                  <RotateCcw className="h-4 w-4" />
                  Analyse another report
                </button>
              </div>
            </motion.div>
          )}

          {/* Notification/Toast */}
          {notification.show && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white ${
                  notification.type === "success" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {notification.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <X className="h-5 w-5" />}
                <span>{notification.message}</span>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PdfAnalyzer;
