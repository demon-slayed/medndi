import React, { useState, useEffect } from "react";
import axios from "axios";
import useAppStore from "@/store/useAppStore";

const PostCareRequestForm = () => {
  const [applications, setApplications] = useState([]);
  const [postCareServices, setPostCareServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({
    report: null,
    prescription: null,
  });
  
  const { auth } = useAppStore();

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phoneNumber: "",
    preferredLanguage: "",
    homeCountryCity: "",
    emergencyContact: "",
    procedureId: "",
    wasMedicalTourism: "Yes",
    postCareTypeId: "",
    preferredFollowUpDates: "",
    preferredTimeZone: "",
    preferredTimeRange: "",
    needsLanguageSupport: "No",
    languageSupportSpecify: "",
    currentMedications: "",
    knownAllergies: "",
    stillAbroad: "No",
    expectedReturnDate: "",
    needsAccommodationHelp: "No",
    additionalNotes: "",
    report_url: "", 
    prescription_url: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user's applications
        const applicationsRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/application/getByUserId/${
            auth?._id
          }`,
          { withCredentials: true }
        );

        // Fetch available post-care services
        const postCareRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/post-treatment/getall`,
          { withCredentials: true }
        );

        setApplications(applicationsRes.data);
        console.log(
          "applications for user in postTreatments is: ",
          applicationsRes?.data
        );

        setPostCareServices(postCareRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load necessary data. Please try again later.");
        setLoading(false);
      }
    };

    if (auth?._id) {
      fetchData();
    }
  }, [auth]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleApplicationSelect = (e) => {
    const appId = e.target.value;
    const selected = applications.find((app) => app._id === appId);
    setSelectedApplication(selected);

    // Pre-fill some fields based on the selected application
    if (selected) {
      setFormData({
        ...formData,
        procedureId: appId,
        // You can pre-fill other fields if needed
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setSelectedFiles((prev) => ({
      ...prev,
      [name]: files[0],
    }));
    console.log(e.target.files[0]);
    
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
  
    try {
      // Upload files to Cloudinary
      const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append("myfile", file);
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/post-treatment/file-upload`,
          formData,
          { withCredentials: true }
        );
        return response.data.filePath; // Cloudinary URL
      };
  
      const [reportUrl, prescriptionUrl] = await Promise.all([
        uploadFile(selectedFiles.report),
        uploadFile(selectedFiles.prescription),
      ]);
  
      // // Update application with PostTreatment ID
      // await axios.put(
      //   `${import.meta.env.VITE_BASE_URL}/application/update/${formData.procedureId}`,
      //   { PostTreatment_id: formData.postCareTypeId },
      //   { withCredentials: true }
      // );
  
      // Create post-care form entry with file URLs included
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/postcareform/create`,
        {
          application_id: formData.procedureId,
          patient_name: formData.fullName,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          email: formData.email,
          phone_number: formData.phoneNumber,
          preferred_language: formData.preferredLanguage,
          home_location: formData.homeCountryCity,
          emergency_contact: formData.emergencyContact,
          post_treatment_id: formData.postCareTypeId,
          preferred_followup_dates: formData.preferredFollowUpDates,
          preferred_timezone: formData.preferredTimeZone,
          preferred_time_range: formData.preferredTimeRange,
          needs_language_support: formData.needsLanguageSupport === 'Yes',
          language_support_details: formData.languageSupportSpecify,
          current_medications: formData.currentMedications,
          known_allergies: formData.knownAllergies,
          still_abroad: formData.stillAbroad === 'Yes',
          expected_return_date: formData.expectedReturnDate,
          needs_accommodation_help: formData.needsAccommodationHelp === 'Yes',
          additional_notes: formData.additionalNotes,
          report_url: reportUrl,                // Attach file URLs here
          prescription_url: prescriptionUrl     // 👈 make sure backend handles these fields
        },
        { withCredentials: true }
      );
  
      console.log("post care form is: ", formData);
      console.log("response of create postcare is: ", response?.data);
      
      setSuccess(true);
      // Reset form if needed
  
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit your post-care request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  

  if (loading) {
    return <div className="text-center py-10">Loading form data...</div>;
  }

  if (error && !success) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        <button
          className="ml-4 text-red-500 underline"
          onClick={() => setError(null)}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-8 rounded text-center">
        <h3 className="text-xl font-bold mb-2">
          Post-Care Request Submitted Successfully!
        </h3>
        <p>
          We've received your request and will contact you shortly to confirm
          the details.
        </p>
        <button
          className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          onClick={() => window.location.reload()}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
        🧾 Post-Care Request Form
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Information Section */}
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">
            👤 Patient Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name*
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth*
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender*
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number*
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Language*
              </label>
              <input
                type="text"
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Home Country / City*
              </label>
              <input
                type="text"
                name="homeCountryCity"
                value={formData.homeCountryCity}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact Name & Number*
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Treatment Information Section */}
        <div className="bg-green-50 p-4 rounded-md">
          <h3 className="text-xl font-semibold text-green-800 mb-4">
            🏥 Treatment Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Your Procedure*
              </label>
              <select
                name="procedureId"
                value={formData.procedureId}
                onChange={handleApplicationSelect}
                required
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select your procedure</option>
                {applications.map((app) => (
                  <option key={app._id} value={app._id}>
                    {app.treatment_id?.treatment_name || "Unknown Treatment"} -{" "}
                    {new Date(app.treatmentdateandtime).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {selectedApplication && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Procedure Date
                  </label>
                  <div className="p-2 bg-white border border-gray-300 rounded">
                    {new Date(
                      selectedApplication.treatmentdateandtime
                    ).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Treating Hospital / Clinic
                  </label>
                  <div className="p-2 bg-white border border-gray-300 rounded">
                    {selectedApplication.hospital_id?.hospital_name ||
                      "Not specified"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Was this part of medical tourism?*
                  </label>
                  <select
                    name="wasMedicalTourism"
                    value={formData.wasMedicalTourism}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Treatment Location
                  </label>
                  <div className="p-2 bg-white border border-gray-300 rounded">
                    {selectedApplication.hospital_id?.address ||
                      "Not specified"}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Post-Care Needs Section */}
        <div className="bg-purple-50 p-4 rounded-md">
          <h3 className="text-xl font-semibold text-purple-800 mb-4">
            💊 Post-Care Needs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type of Post-Care Required*
              </label>
              <select
                name="postCareTypeId"
                value={formData.postCareTypeId}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select post-care service</option>
                {postCareServices.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.service_name} - {service.service_type} (₹
                    {service.cost})
                  </option>
                ))}
              </select>
              {formData.postCareTypeId && (
                <div className="mt-2 text-sm text-gray-600">
                  {
                    postCareServices.find(
                      (s) => s._id === formData.postCareTypeId
                    )?.description
                  }
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Follow-Up Date(s)*
              </label>
              <input
                type="text"
                name="preferredFollowUpDates"
                value={formData.preferredFollowUpDates}
                onChange={handleChange}
                placeholder="e.g., May 5-10, 2025"
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time Zone*
                </label>
                <input
                  type="text"
                  name="preferredTimeZone"
                  value={formData.preferredTimeZone}
                  onChange={handleChange}
                  placeholder="e.g., GMT+1, EST"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Range*
                </label>
                <input
                  type="text"
                  name="preferredTimeRange"
                  value={formData.preferredTimeRange}
                  onChange={handleChange}
                  placeholder="e.g., 9AM-5PM"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Do you need language support for post-care?*
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="langSupportYes"
                    name="needsLanguageSupport"
                    value="Yes"
                    checked={formData.needsLanguageSupport === "Yes"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="langSupportYes">Yes</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="langSupportNo"
                    name="needsLanguageSupport"
                    value="No"
                    checked={formData.needsLanguageSupport === "No"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="langSupportNo">No</label>
                </div>
              </div>

              {formData.needsLanguageSupport === "Yes" && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specify language:
                  </label>
                  <input
                    type="text"
                    name="languageSupportSpecify"
                    value={formData.languageSupportSpecify}
                    onChange={handleChange}
                    required={formData.needsLanguageSupport === "Yes"}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Medical Info & Attachments Section */}
        <div className="bg-yellow-50 p-4 rounded-md">
          <h3 className="text-xl font-semibold text-yellow-800 mb-4">
            📄 Medical Info & Attachments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Discharge Summary
              </label>
              <input
                type="file"
                name="report"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Prescription / Care Plan
              </label>
              <input
                type="file"
                name="prescription"
                onChange={handleFileChange }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                List of Current Medications
              </label>
              <textarea
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Known Allergies or Conditions
              </label>
              <textarea
                name="knownAllergies"
                value={formData.knownAllergies}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Travel & Accommodation Section */}
        <div className="bg-red-50 p-4 rounded-md">
          <h3 className="text-xl font-semibold text-red-800 mb-4">
            🧳 Travel & Accommodation (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Are you still abroad after your treatment?*
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="abroadYes"
                    name="stillAbroad"
                    value="Yes"
                    checked={formData.stillAbroad === "Yes"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="abroadYes">Yes</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="abroadNo"
                    name="stillAbroad"
                    value="No"
                    checked={formData.stillAbroad === "No"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="abroadNo">No</label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Date of Return Home
              </label>
              <input
                type="date"
                name="expectedReturnDate"
                value={formData.expectedReturnDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Do you need help arranging recovery accommodation or travel?
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="accommodationYes"
                    name="needsAccommodationHelp"
                    value="Yes"
                    checked={formData.needsAccommodationHelp === "Yes"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="accommodationYes">Yes</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="accommodationNo"
                    name="needsAccommodationHelp"
                    value="No"
                    checked={formData.needsAccommodationHelp === "No"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="accommodationNo">No</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Notes Section */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🗨 Additional Notes / Special Requests
          </h3>
          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Please provide any additional information that may be helpful for your post-care coordination."
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg flex items-center transition duration-300"
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              </>
            ) : (
              <>✅ Submit Post-Care Request</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostCareRequestForm;
