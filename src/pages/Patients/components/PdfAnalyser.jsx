// src/components/PdfAnalyzer.jsx
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import {
  FileText,
  Upload,
  X,
  AlertTriangle,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import Layout from "@/components/Layout/Layout";

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

      if (response.data.success) {
        setAnalysis(response.data);
        setOpenSnackbar(true);
      } else {
        setError(response.data.message || "Error analyzing PDF");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Error communicating with server"
      );
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white mt-2">
        <div className="container mx-auto px-4 py-12">
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <main className=" mx-auto px-4 py-8 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-violet-50 via-indigo-50 to-slate-50 rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-8">
                <div className="p-8 sm:p-10">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white mb-4 shadow-lg shadow-indigo-200">
                      <FileText className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent mb-3">
                      Medical Document Analyzer
                    </h2>
                    <p className="text-slate-600 max-w-lg mx-auto leading-relaxed">
                      Upload patient PDF documents for our AI-powered analysis
                      engine to extract key insights and clinical data
                    </p>
                  </div>

                  <div className="border-t border-slate-200 my-6 opacity-50"></div>

                  <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                    <div
                      className={`p-10 border-2 border-dashed rounded-2xl text-center transition-all duration-300 ease-in-out
              ${
                file
                  ? "border-indigo-400 bg-indigo-50/60"
                  : "border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/60"
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
                        className="hidden"
                      />

                      <div className="flex flex-col items-center justify-center space-y-5">
                        <div
                          className={`h-24 w-24 rounded-full flex items-center justify-center transition-all duration-300
                  ${
                    file
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                        >
                          {file ? (
                            <FileCheck className="h-12 w-12" />
                          ) : (
                            <Upload className="h-12 w-12" />
                          )}
                        </div>

                        {!file ? (
                          <>
                            <label
                              htmlFor="pdf-upload"
                              className="px-6 py-3 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl cursor-pointer hover:from-violet-700 hover:to-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all shadow-md hover:shadow-lg"
                            >
                              Select PDF File
                            </label>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                              <span className="h-px w-12 bg-slate-300"></span>
                              <span>or drag and drop your file here</span>
                              <span className="h-px w-12 bg-slate-300"></span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                              Supported format: PDF up to 10MB
                            </p>
                          </>
                        ) : (
                          <div className="w-full max-w-md">
                            <div className="flex items-center justify-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm backdrop-blur-sm bg-white/80">
                              <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-indigo-50 flex items-center justify-center mr-3">
                                <FileText className="h-6 w-6 text-indigo-500" />
                              </div>
                              <div className="flex-1 truncate">
                                <p className="font-medium text-slate-700 truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={clearResults}
                                className="ml-3 text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>

                            <label
                              htmlFor="pdf-upload"
                              className="mt-4 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer transition-colors"
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Choose a different file
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {error && (
                      <div className="mt-5 bg-red-50 text-red-700 p-4 rounded-xl text-sm flex items-start border border-red-100 animate-fadeIn">
                        <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
                        <p>{error}</p>
                      </div>
                    )}

                    <div className="mt-8 text-center">
                      <button
                        type="submit"
                        disabled={loading || !file}
                        className={`px-10 py-3 rounded-xl text-white font-medium transition-all transform 
                ${
                  loading || !file
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 active:scale-98 shadow-md hover:shadow-lg"
                }`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <FileText className="mr-2 h-5 w-5" />
                            Analyze Document
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {analysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <h3 className="text-xl font-bold text-slate-800 flex items-center">
                        <svg
                          className="h-6 w-6 text-blue-600 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Analysis Results
                      </h3>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-700">
                          {analysis.fileName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {analysis.fileStored
                            ? "Stored on server"
                            : "Deleted after processing"}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 my-6"></div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Potential Conditions */}
                      <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-red-50 px-4 py-3 border-b border-slate-200">
                          <h3 className="font-medium text-red-800 flex items-center">
                            <svg
                              className="h-5 w-5 mr-2"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            Potential Conditions
                          </h3>
                        </div>
                        <div className="p-4">
                          {analysis.analysis.potentialConditions?.length > 0 ? (
                            <ul className="space-y-2">
                              {analysis.analysis.potentialConditions.map(
                                (condition, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2 mt-0.5">
                                      <svg
                                        className="h-3 w-3"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                    <span className="text-slate-700">
                                      {condition}
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="text-slate-500 text-sm italic">
                              No conditions identified
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Key Symptoms */}
                      <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-blue-50 px-4 py-3 border-b border-slate-200">
                          <h3 className="font-medium text-blue-800 flex items-center">
                            <svg
                              className="h-5 w-5 mr-2"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                              />
                            </svg>
                            Key Symptoms
                          </h3>
                        </div>
                        <div className="p-4">
                          {analysis.analysis.keySymptoms?.length > 0 ? (
                            <ul className="space-y-2">
                              {analysis.analysis.keySymptoms.map(
                                (symptom, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-0.5">
                                      <svg
                                        className="h-3 w-3"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                    <span className="text-slate-700">
                                      {symptom}
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="text-slate-500 text-sm italic">
                              No key symptoms identified
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Concerning Factors */}
                      <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-amber-50 px-4 py-3 border-b border-slate-200">
                          <h3 className="font-medium text-amber-800 flex items-center">
                            <svg
                              className="h-5 w-5 mr-2"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            Concerning Factors
                          </h3>
                        </div>
                        <div className="p-4">
                          {analysis.analysis.concerningFactors?.length > 0 ? (
                            <ul className="space-y-2">
                              {analysis.analysis.concerningFactors.map(
                                (factor, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-2 mt-0.5">
                                      <svg
                                        className="h-3 w-3"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                    <span className="text-slate-700">
                                      {factor}
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="text-slate-500 text-sm italic">
                              No concerning factors identified
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Related Information */}
                      <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-indigo-50 px-4 py-3 border-b border-slate-200">
                          <h3 className="font-medium text-indigo-800 flex items-center">
                            <svg
                              className="h-5 w-5 mr-2"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Related Information
                          </h3>
                        </div>
                        <div className="p-4">
                          {analysis.analysis.relatedInfo?.length > 0 ? (
                            <ul className="space-y-2">
                              {analysis.analysis.relatedInfo.map(
                                (info, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 mt-0.5">
                                      <svg
                                        className="h-3 w-3"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                    <span className="text-slate-700">
                                      {info}
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="text-slate-500 text-sm italic">
                              No related information available
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 text-center">
                      <button
                        type="button"
                        onClick={clearResults}
                        className="px-6 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <span className="flex items-center">
                          <svg
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Clear Results
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </main>

            {/* Notification/Toast */}
            {notification.show && (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={`px-4 py-3 rounded-lg shadow-lg flex items-center ${
                    notification.type === "success"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {notification.type === "success" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    )}
                  </svg>
                  <span>{notification.message}</span>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PdfAnalyzer;
