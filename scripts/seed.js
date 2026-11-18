// Seeds a local database with demo catalog data and two accounts.
// Usage: npm run seed   (wipes catalog, applications and post-care forms first; keeps other users)
import mongoose from "mongoose";
import dotenv from "dotenv";
import Hospital from "../models/hospitalModel.js";
import Treatment from "../models/treatmentModel.js";
import Hotel from "../models/hotelSchema.js";
import Insurance from "../models/insuranceModel.js";
import PostTreatment from "../models/postTreatmentModel.js";
import User from "../models/userModel.js";
import Application from "../models/application.js";
import PostCareForm from "../models/postCareFormModel.js";
import { hashPassword } from "../utils/bcryptHelper.js";

dotenv.config();

export const DEMO_ADMIN = { email: "admin@arogini.test", password: "Admin@123" };
export const DEMO_PATIENT = { email: "patient@arogini.test", password: "Patient@123" };

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;
const doctorImg = (gender, n) => `https://randomuser.me/api/portraits/${gender}/${n}.jpg`;

const hospitalData = [
  {
    hospital_id: "HOSP-APOLLO-DEL",
    hospital_name: "Apollo Hospitals",
    address: "Sarita Vihar, Delhi Mathura Road, New Delhi, India",
    accreditation: "JCI, NABH",
    rating: 4.8,
    treatmentCost: 4500,
    hospital_image: [img("photo-1586773860418-d37222d8fce3"), img("photo-1519494026892-80bbd2d6fd0d")],
    stats: { successRate: "97%", experience: "40+ years", patients: "50,000+" },
    badges: ["JCI Accredited", "NABH Certified"],
    specialties: ["Cardiology", "Orthopedics", "Oncology"],
    key_highlights: [
      { label: "Bed Capacity", value: "710", trend: "up" },
      { label: "Specialists", value: "300+", trend: "up" },
      { label: "Countries Served", value: "120", trend: "stable" },
      { label: "ICU Beds", value: "150", trend: "up" },
    ],
    description: "One of Asia's largest integrated healthcare providers, known for cardiac surgery, organ transplants and cancer care.",
    highlights: [
      { title: "International Patient Desk", description: "Dedicated coordinators for visas, travel and interpreters." },
      { title: "Robotic Surgery", description: "Da Vinci robotic systems for minimally invasive procedures." },
    ],
    amenities: [
      { label: "Free Wi-Fi", description: "High-speed internet across the campus" },
      { label: "Airport Pickup", description: "Complimentary pickup for international patients" },
      { label: "Pharmacy", description: "24x7 in-house pharmacy" },
    ],
    doctors: [
      { name: "Dr. Rajesh Mehra", specialty: "Cardiology", experience: "25 years", rating: 4.9, image: doctorImg("men", 32), qualifications: "MBBS, MD, DM (Cardiology)", expertise: "Coronary bypass, valve replacement" },
      { name: "Dr. Anita Sharma", specialty: "Orthopedics", experience: "18 years", rating: 4.7, image: doctorImg("women", 44), qualifications: "MBBS, MS (Ortho)", expertise: "Knee and hip replacement" },
    ],
    contact_number: "+91 11 2692 5858",
    email: "intl@apollo.test",
    website: "https://www.apollohospitals.com",
  },
  {
    hospital_id: "HOSP-MEDANTA-GGN",
    hospital_name: "Medanta - The Medicity",
    address: "Sector 38, Gurugram, Haryana, India",
    accreditation: "JCI, NABH, NABL",
    rating: 4.7,
    treatmentCost: 5200,
    hospital_image: [img("photo-1538108149393-fbbd81895907"), img("photo-1516549655169-df83a0774514")],
    stats: { successRate: "96%", experience: "15+ years", patients: "35,000+" },
    badges: ["JCI Accredited", "Green OT"],
    specialties: ["Neurosciences", "Cardiology", "Liver Transplant"],
    key_highlights: [
      { label: "Bed Capacity", value: "1,250", trend: "up" },
      { label: "Operation Theatres", value: "45", trend: "stable" },
      { label: "Specialists", value: "800+", trend: "up" },
      { label: "Countries Served", value: "90", trend: "up" },
    ],
    description: "Multi-super-speciality institute with leading programmes in neurosciences, cardiac care and liver transplantation.",
    highlights: [
      { title: "Transplant Centre", description: "High-volume liver and kidney transplant programme." },
      { title: "Neuro ICU", description: "Dedicated neuro critical care with 24x7 intensivists." },
    ],
    amenities: [
      { label: "Interpreters", description: "Arabic, Russian, French and more" },
      { label: "Guest House", description: "On-campus stay for attendants" },
    ],
    doctors: [
      { name: "Dr. Vikram Rao", specialty: "Neurosurgery", experience: "22 years", rating: 4.8, image: doctorImg("men", 51), qualifications: "MBBS, MCh (Neurosurgery)", expertise: "Spine surgery, brain tumours" },
      { name: "Dr. Priya Nair", specialty: "Hepatology", experience: "16 years", rating: 4.6, image: doctorImg("women", 65), qualifications: "MBBS, MD, DM (Hepatology)", expertise: "Liver transplant" },
    ],
    contact_number: "+91 124 414 1414",
    email: "intl@medanta.test",
    website: "https://www.medanta.org",
  },
  {
    hospital_id: "HOSP-MAX-DEL",
    hospital_name: "Max Super Speciality Hospital",
    address: "Saket, New Delhi, India",
    accreditation: "NABH, NABL",
    rating: 4.6,
    treatmentCost: 3800,
    hospital_image: [img("photo-1632833239869-a37e3a5806d2"), img("photo-1587351021759-3e566b6af7cc")],
    stats: { successRate: "95%", experience: "20+ years", patients: "40,000+" },
    badges: ["NABH Certified"],
    specialties: ["Oncology", "Orthopedics", "IVF"],
    key_highlights: [
      { label: "Bed Capacity", value: "530", trend: "stable" },
      { label: "Specialists", value: "400+", trend: "up" },
      { label: "Cancer Cases / Year", value: "10,000", trend: "up" },
      { label: "Countries Served", value: "70", trend: "stable" },
    ],
    description: "Tertiary-care hospital known for comprehensive cancer care, joint replacement and fertility treatment.",
    highlights: [
      { title: "Cancer Centre", description: "Radiation, medical and surgical oncology under one roof." },
      { title: "Joint Replacement", description: "Computer-navigated knee and hip replacement." },
    ],
    amenities: [
      { label: "Free Wi-Fi", description: "Available in all rooms" },
      { label: "Currency Exchange", description: "On-site forex desk" },
    ],
    doctors: [
      { name: "Dr. Sanjay Gupta", specialty: "Oncology", experience: "20 years", rating: 4.7, image: doctorImg("men", 41), qualifications: "MBBS, MD, DM (Oncology)", expertise: "Breast and lung cancer" },
      { name: "Dr. Meera Iyer", specialty: "Reproductive Medicine", experience: "14 years", rating: 4.8, image: doctorImg("women", 28), qualifications: "MBBS, MS (OBG)", expertise: "IVF, ICSI" },
    ],
    contact_number: "+91 11 2651 5050",
    email: "intl@max.test",
    website: "https://www.maxhealthcare.in",
  },
];

// Hotels are keyed by hospital_id so we can link them after hospitals are inserted.
const hotelData = {
  "HOSP-APOLLO-DEL": [
    { hotel_id: "HOTEL-APOLLO-1", hotel_name: "The Grand Residency", image: img("photo-1566073771259-6a8506099945"), description: "Comfortable stay with medical-friendly rooms and shuttle service.", location: "Sarita Vihar, New Delhi", distance: "1.2 km", price_per_night: 85, rating: 4.4, amenities: ["Free WiFi", "Airport Shuttle", "Restaurant"] },
    { hotel_id: "HOTEL-APOLLO-2", hotel_name: "Comfort Suites", image: img("photo-1582719478250-c89cae4dc85b"), description: "Budget-friendly serviced apartments with kitchenette.", location: "Jasola, New Delhi", distance: "2.5 km", price_per_night: 55, rating: 4.1, amenities: ["Free WiFi", "Kitchenette", "Laundry"] },
  ],
  "HOSP-MEDANTA-GGN": [
    { hotel_id: "HOTEL-MEDANTA-1", hotel_name: "Medicity Inn", image: img("photo-1542314831-068cd1dbfeeb"), description: "Walking distance to Medanta with attendant-friendly rooms.", location: "Sector 38, Gurugram", distance: "0.5 km", price_per_night: 95, rating: 4.5, amenities: ["Free WiFi", "Pool", "Gym"] },
  ],
  "HOSP-MAX-DEL": [
    { hotel_id: "HOTEL-MAX-1", hotel_name: "Saket Square Hotel", image: img("photo-1571896349842-33c89424de2d"), description: "Modern hotel near Select Citywalk with hospital shuttle.", location: "Saket, New Delhi", distance: "1.0 km", price_per_night: 75, rating: 4.3, amenities: ["Free WiFi", "Restaurant", "Hospital Shuttle"] },
  ],
};

const treatmentData = [
  { treatment_id: "TRT-KNEE", treatment_name: "Knee Replacement", category: "Orthopedics", image: img("photo-1559757175-5700dde675bc"), location: "New Delhi, India", rating: 4.8, estimated_cost: { min: 4000, max: 7000 }, duration: "7-10 days", success_rate: "96%", features: ["Robotic-assisted surgery", "Physiotherapy included", "Implant warranty"], patients: "5,000+", tags: "Popular", experience: "20+ years", support: "24/7", description: "Total or partial knee replacement to relieve pain and restore mobility.", hospitals: ["HOSP-APOLLO-DEL", "HOSP-MAX-DEL"] },
  { treatment_id: "TRT-CABG", treatment_name: "Heart Bypass Surgery (CABG)", category: "Cardiology", image: img("photo-1628348068343-c6a848d2b6dd"), location: "New Delhi, India", rating: 4.9, estimated_cost: { min: 5500, max: 9000 }, duration: "10-14 days", success_rate: "98%", features: ["Beating-heart surgery", "Cardiac rehab", "ICU care"], patients: "8,000+", tags: "Top Rated", experience: "25+ years", support: "24/7", description: "Coronary artery bypass grafting to restore blood flow to the heart.", hospitals: ["HOSP-APOLLO-DEL", "HOSP-MEDANTA-GGN"] },
  { treatment_id: "TRT-LIVER", treatment_name: "Liver Transplant", category: "Transplant", image: img("photo-1579684385127-1ef15d508118"), location: "Gurugram, India", rating: 4.7, estimated_cost: { min: 28000, max: 40000 }, duration: "3-4 weeks", success_rate: "94%", features: ["Living donor programme", "Dedicated transplant ICU", "Lifetime follow-up"], patients: "2,500+", tags: "Specialised", experience: "15+ years", support: "24/7", description: "Living or deceased donor liver transplantation for end-stage liver disease.", hospitals: ["HOSP-MEDANTA-GGN"] },
  { treatment_id: "TRT-IVF", treatment_name: "IVF Treatment", category: "Fertility", image: img("photo-1584515933487-779824d29309"), location: "New Delhi, India", rating: 4.6, estimated_cost: { min: 2500, max: 4500 }, duration: "2-3 weeks", success_rate: "65%", features: ["ICSI available", "Embryo freezing", "Counselling"], patients: "3,000+", tags: "Affordable", experience: "14+ years", support: "Mon-Sat", description: "In-vitro fertilisation with personalised protocols.", hospitals: ["HOSP-MAX-DEL"] },
  { treatment_id: "TRT-SPINE", treatment_name: "Spine Surgery", category: "Neurosciences", image: img("photo-1530497610245-94d3c16cda28"), location: "Gurugram, India", rating: 4.7, estimated_cost: { min: 6000, max: 11000 }, duration: "7-12 days", success_rate: "95%", features: ["Minimally invasive", "Neuro-navigation", "Rehab programme"], patients: "4,000+", tags: "Advanced", experience: "22+ years", support: "24/7", description: "Disc replacement, fusion and minimally invasive spine procedures.", hospitals: ["HOSP-MEDANTA-GGN"] },
  { treatment_id: "TRT-CANCER", treatment_name: "Cancer Treatment", category: "Oncology", image: img("photo-1576091160550-2173dba999ef"), location: "New Delhi, India", rating: 4.8, estimated_cost: { min: 8000, max: 25000 }, duration: "Varies", success_rate: "90%", features: ["Tumour board review", "Radiation & chemo", "Targeted therapy"], patients: "10,000+", tags: "Comprehensive", experience: "20+ years", support: "24/7", description: "Multidisciplinary cancer care including surgery, chemotherapy and radiation.", hospitals: ["HOSP-MAX-DEL", "HOSP-APOLLO-DEL"] },
];

const insuranceData = [
  { insurance_id: "INS-BASIC", name: "Arogini Basic Cover", description: "Covers complications during your treatment stay.", features: ["Complication cover up to $5,000", "Emergency evacuation"], price: 120, emi_options: ["3 months"], eligibility_criteria: "Age 18-65", government_schemes: [] },
  { insurance_id: "INS-PLUS", name: "Arogini Plus", description: "Treatment complications plus travel and follow-up care.", features: ["Complication cover up to $15,000", "Trip cancellation", "Follow-up teleconsults"], price: 290, emi_options: ["3 months", "6 months"], eligibility_criteria: "Age 18-70", government_schemes: ["Ayushman Bharat (eligible patients)"] },
  { insurance_id: "INS-PREMIUM", name: "Arogini Premium", description: "Comprehensive cover including companion travel.", features: ["Complication cover up to $40,000", "Companion travel cover", "Repatriation"], price: 540, emi_options: ["3 months", "6 months", "12 months"], eligibility_criteria: "Age 0-75", government_schemes: [] },
];

const postTreatmentData = [
  { service_name: "Teleconsultation Follow-up", service_type: "Consultation", description: "Video follow-up with your treating doctor.", cost: 40 },
  { service_name: "Home Physiotherapy", service_type: "Rehabilitation", description: "Guided physiotherapy sessions at home.", cost: 60 },
  { service_name: "Medication Delivery", service_type: "Pharmacy", description: "International delivery of prescribed medicines.", cost: 25 },
];

async function upsertUser({ email, password }, extra) {
  const hashed = await hashPassword(password);
  await User.findOneAndUpdate(
    { email },
    { $set: { email, password: hashed, ...extra } },
    { upsert: true, setDefaultsOnInsert: true }
  );
}

async function seed() {
  await mongoose.connect(process.env.MONGO_DB_URL);

  await Promise.all([Hospital, Treatment, Hotel, Insurance, PostTreatment, Application, PostCareForm].map((m) => m.deleteMany({})));

  const hospitals = await Hospital.insertMany(hospitalData);
  const hospitalByCode = Object.fromEntries(hospitals.map((h) => [h.hospital_id, h]));

  for (const [code, hotels] of Object.entries(hotelData)) {
    const hospital = hospitalByCode[code];
    const created = await Hotel.insertMany(
      hotels.map((h) => ({ ...h, hospital_id: hospital._id, hospital_nearby: [hospital.hospital_name] }))
    );
    hospital.Hotels = created.map((h) => h._id);
    await hospital.save();
  }

  await Treatment.insertMany(
    treatmentData.map(({ hospitals: codes, ...t }) => {
      const first = hospitalByCode[codes[0]];
      return {
        ...t,
        email: first.email,
        phone: first.contact_number,
        available_hospitals: codes.map((c) => hospitalByCode[c]._id),
      };
    })
  );

  await Insurance.insertMany(insuranceData);
  await PostTreatment.insertMany(postTreatmentData);

  await upsertUser(DEMO_ADMIN, { fullName: "Arogini Admin", role: "Admin", age: 35, height: 175, weight: 72, gender: "Male" });
  await upsertUser(DEMO_PATIENT, { fullName: "Demo Patient", role: "User", age: 42, height: 168, weight: 70, gender: "Female", nationality: "Kenyan" });

  console.log(`Seeded ${hospitals.length} hospitals, ${treatmentData.length} treatments, ${insuranceData.length} insurance plans.`);
  console.log(`Admin:   ${DEMO_ADMIN.email} / ${DEMO_ADMIN.password}`);
  console.log(`Patient: ${DEMO_PATIENT.email} / ${DEMO_PATIENT.password}`);
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
