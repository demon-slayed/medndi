import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import useAppStore from "@/store/useAppStore";
import { formatDateTime } from "@/components/booking/formatDateTime";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  HeartPulse,
  Loader2,
  MessageSquare,
  Plane,
  Send,
  Stethoscope,
  User,
} from "lucide-react";

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

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const [applicationsRes, postCareRes] = await Promise.allSettled([
        axios.get(
          `${import.meta.env.VITE_BASE_URL}/application/getByUserId/${auth?._id}`,
          { withCredentials: true }
        ),
        axios.get(`${import.meta.env.VITE_BASE_URL}/post-treatment/getall`, {
          withCredentials: true,
        }),
      ]);

      const toList = (result) =>
        result.status === "fulfilled" && Array.isArray(result.value.data)
          ? result.value.data
          : [];
      setApplications(toList(applicationsRes));
      setPostCareServices(toList(postCareRes));
      if (applicationsRes.status === "rejected" || postCareRes.status === "rejected") {
        setError("Failed to load necessary data. Please try again.");
      }
      setLoading(false);
    };

    if (auth?._id) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [auth?._id, reloadKey]);

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
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
  
    try {
      // Files are optional; only upload what the patient picked
      const uploadFile = async (file) => {
        if (!file) return "";
        const formData = new FormData();
        formData.append("myfile", file);
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/post-treatment/file-upload`,
          formData,
          { withCredentials: true }
        );
        return response.data.filePath;
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
      await axios.post(
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
          prescription_url: prescriptionUrl
        },
        { withCredentials: true }
      );
  
      
      setSuccess(true);
      // Reset form if needed
  
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(
        err?.response?.data?.message && err.response.data.message !== "Server error"
          ? err.response.data.message
          : "Failed to submit your post-care request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };
  

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!error && applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
          <HeartPulse className="w-7 h-7 text-[#3252DF]" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-900">
          Post-care support starts after your treatment booking
        </h3>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          Once you have a booking, you can request follow-ups, physiotherapy and more here.
        </p>
        <Link
          to="/treatments"
          className="mt-6 inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
        >
          Browse treatments
        </Link>
      </div>
    );
  }

  if (error && !success) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p className="flex-1">{error}</p>
        <button
          type="button"
          className="self-start sm:self-auto px-4 py-2 rounded-lg border border-red-300 text-red-700 font-medium hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          onClick={() => setReloadKey((k) => k + 1)}
        >
          Try again
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-10 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-900">
          Post-care request submitted
        </h3>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          We&apos;ve received your request and will contact you shortly to confirm
          the details.
        </p>
        <button
          type="button"
          className="mt-6 px-6 py-2.5 rounded-lg border-2 border-[#3252DF] text-[#3252DF] font-medium hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40"
          onClick={() => window.location.reload()}
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Request post-care support
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Tell us what you need after your treatment and our care team will arrange it. Fields marked * are required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <FormSection icon={User} title="Patient information">
          <Field label="Full name" htmlFor="pc-fullName" required>
            <input id="pc-fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required autoComplete="name" className={inputCls} />
          </Field>
          <Field label="Date of birth" htmlFor="pc-dob" required>
            <input id="pc-dob" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className={inputCls} />
          </Field>
          <Field label="Gender" htmlFor="pc-gender" required>
            <select id="pc-gender" name="gender" value={formData.gender} onChange={handleChange} required className={inputCls}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </Field>
          <Field label="Email" htmlFor="pc-email" required>
            <input id="pc-email" type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" className={inputCls} />
          </Field>
          <Field label="Phone number" htmlFor="pc-phone" required>
            <input id="pc-phone" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required autoComplete="tel" placeholder="+91 98765 43210" className={inputCls} />
          </Field>
          <Field label="Preferred language" htmlFor="pc-lang" required>
            <input id="pc-lang" type="text" name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange} required placeholder="e.g. English" className={inputCls} />
          </Field>
          <Field label="Home country / city" htmlFor="pc-home" required>
            <input id="pc-home" type="text" name="homeCountryCity" value={formData.homeCountryCity} onChange={handleChange} required placeholder="e.g. Nairobi, Kenya" className={inputCls} />
          </Field>
          <Field label="Emergency contact name & number" htmlFor="pc-emergency" required>
            <input id="pc-emergency" type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} required className={inputCls} />
          </Field>
        </FormSection>

        <FormSection icon={Stethoscope} title="Treatment information">
          <Field label="Select your procedure" htmlFor="pc-procedure" required className="md:col-span-2">
            <select id="pc-procedure" name="procedureId" value={formData.procedureId} onChange={handleApplicationSelect} required className={inputCls}>
              <option value="">Select your procedure</option>
              {applications.map((app) => (
                <option key={app._id} value={app._id}>
                  {app.treatment_id?.treatment_name || "Unknown Treatment"} -{" "}
                  {formatDateTime(app.treatmentdateandtime)}
                </option>
              ))}
            </select>
          </Field>

          {selectedApplication && (
            <>
              <Field label="Procedure date">
                <div className={readOnlyCls}>{formatDateTime(selectedApplication.treatmentdateandtime)}</div>
              </Field>
              <Field label="Treating hospital">
                <div className={readOnlyCls}>{selectedApplication.hospital_id?.hospital_name || "Not specified"}</div>
              </Field>
              <Field label="Was this part of medical tourism?" htmlFor="pc-tourism" required>
                <select id="pc-tourism" name="wasMedicalTourism" value={formData.wasMedicalTourism} onChange={handleChange} required className={inputCls}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </Field>
              <Field label="Treatment location">
                <div className={readOnlyCls}>{selectedApplication.hospital_id?.address || "Not specified"}</div>
              </Field>
            </>
          )}
        </FormSection>

        <FormSection icon={HeartPulse} title="Post-care needs">
          <Field label="Type of post-care required" htmlFor="pc-type" required className="md:col-span-2">
            <select id="pc-type" name="postCareTypeId" value={formData.postCareTypeId} onChange={handleChange} required className={inputCls}>
              <option value="">Select post-care service</option>
              {postCareServices.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.service_name} - {service.service_type} (₹
                  {service.cost?.toLocaleString("en-IN")})
                </option>
              ))}
            </select>
            {formData.postCareTypeId && (
              <p className="mt-2 text-sm text-gray-600">
                {postCareServices.find((s) => s._id === formData.postCareTypeId)?.description}
              </p>
            )}
          </Field>

          <Field label="Preferred follow-up date(s)" htmlFor="pc-dates" required>
            <input id="pc-dates" type="text" name="preferredFollowUpDates" value={formData.preferredFollowUpDates} onChange={handleChange} placeholder="e.g. 5–10 May" required className={inputCls} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Time zone" htmlFor="pc-tz" required>
              <input id="pc-tz" type="text" name="preferredTimeZone" value={formData.preferredTimeZone} onChange={handleChange} placeholder="e.g. IST, GMT+3" required className={inputCls} />
            </Field>
            <Field label="Time range" htmlFor="pc-range" required>
              <input id="pc-range" type="text" name="preferredTimeRange" value={formData.preferredTimeRange} onChange={handleChange} placeholder="e.g. 9 AM – 5 PM" required className={inputCls} />
            </Field>
          </div>

          <Field label="Do you need language support for post-care?" required className="md:col-span-2">
            <YesNo name="needsLanguageSupport" value={formData.needsLanguageSupport} onChange={handleChange} />
            {formData.needsLanguageSupport === "Yes" && (
              <div className="mt-3">
                <label htmlFor="pc-lang-specify" className={labelCls}>Which language?</label>
                <input id="pc-lang-specify" type="text" name="languageSupportSpecify" value={formData.languageSupportSpecify} onChange={handleChange} required={formData.needsLanguageSupport === "Yes"} className={inputCls} />
              </div>
            )}
          </Field>
        </FormSection>

        <FormSection icon={FileText} title="Medical info & attachments">
          <Field label="Discharge summary" htmlFor="pc-report">
            <input id="pc-report" type="file" name="report" onChange={handleFileChange} className={fileCls} />
          </Field>
          <Field label="Prescription / care plan" htmlFor="pc-prescription">
            <input id="pc-prescription" type="file" name="prescription" onChange={handleFileChange} className={fileCls} />
          </Field>
          <Field label="Current medications" htmlFor="pc-meds">
            <textarea id="pc-meds" name="currentMedications" value={formData.currentMedications} onChange={handleChange} rows="3" className={inputCls} />
          </Field>
          <Field label="Known allergies or conditions" htmlFor="pc-allergies">
            <textarea id="pc-allergies" name="knownAllergies" value={formData.knownAllergies} onChange={handleChange} rows="3" className={inputCls} />
          </Field>
        </FormSection>

        <FormSection icon={Plane} title="Travel & accommodation" description="Optional">
          <Field label="Are you still in India after your treatment?" required>
            <YesNo name="stillAbroad" value={formData.stillAbroad} onChange={handleChange} />
          </Field>
          <Field label="Expected date of return home" htmlFor="pc-return">
            <input id="pc-return" type="date" name="expectedReturnDate" value={formData.expectedReturnDate} onChange={handleChange} className={inputCls} />
          </Field>
          <Field label="Do you need help arranging recovery accommodation or travel?" className="md:col-span-2">
            <YesNo name="needsAccommodationHelp" value={formData.needsAccommodationHelp} onChange={handleChange} />
          </Field>
        </FormSection>

        <FormSection icon={MessageSquare} title="Additional notes" single>
          <textarea
            aria-label="Additional notes or special requests"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            rows="4"
            className={inputCls}
            placeholder="Anything else that would help us coordinate your post-care."
          />
        </FormSection>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit post-care request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";
const inputCls =
  "w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3252DF]/20 focus:border-[#3252DF]";
const readOnlyCls = "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm";
const fileCls =
  "w-full text-sm text-gray-600 border border-gray-200 rounded-lg bg-white file:mr-3 file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#3252DF] hover:file:bg-blue-100";

const FormSection = ({ icon: Icon, title, description, single = false, children }) => (
  <section>
    <div className="flex items-center gap-3 pb-3 mb-4 border-b border-gray-100">
      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#3252DF]" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && <span className="text-sm text-gray-500">({description})</span>}
    </div>
    {single ? children : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>}
  </section>
);

const Field = ({ label, htmlFor, required = false, className = "", children }) => (
  <div className={className}>
    <label htmlFor={htmlFor} className={labelCls}>
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
    {children}
  </div>
);

const YesNo = ({ name, value, onChange }) => (
  <div className="flex gap-2" role="radiogroup">
    {["Yes", "No"].map((option) => (
      <label
        key={option}
        className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#3252DF]/40 ${
          value === option
            ? "border-[#3252DF] bg-blue-50 text-[#3252DF]"
            : "border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
      >
        <input
          type="radio"
          name={name}
          value={option}
          checked={value === option}
          onChange={onChange}
          className="sr-only"
        />
        {option}
      </label>
    ))}
  </div>
);

export default PostCareRequestForm;
