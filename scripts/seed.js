// Seeds a local database with demo catalog data and two accounts.
// Usage: npm run seed   (wipes catalog, applications and post-care forms first; keeps other users)
// Catalog data lives in ../data/*.json (see data/README.md). All prices are in INR.
import fs from "fs";
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

export const DEMO_ADMIN = { email: "admin@medndi.test", password: "Admin@123" };
export const DEMO_PATIENT = { email: "patient@medndi.test", password: "Patient@123" };
// Demo accounts from before the MedNdi rename; removed on every seed.
const LEGACY_DEMO_EMAILS = ["admin@arogini.test", "patient@arogini.test"];

const TREATMENT_CONTACT = { email: "care@medndi.com", phone: "+91 1800 123 4567" };

const readData = (file) => JSON.parse(fs.readFileSync(new URL(`../data/${file}`, import.meta.url), "utf8"));

const hospitalData = readData("hospitals.json");
const hotelData = readData("hotels.json");
const treatmentData = readData("treatments.json");
const insuranceData = readData("insurance.json");

const postTreatmentData = [
  { service_name: "Teleconsultation Follow-up", service_type: "Consultation", description: "Video follow-up with your treating doctor.", cost: 1500 },
  { service_name: "Home Physiotherapy", service_type: "Rehabilitation", description: "Guided physiotherapy sessions at home.", cost: 2500 },
  { service_name: "Medication Delivery", service_type: "Pharmacy", description: "International delivery of prescribed medicines.", cost: 800 },
];

// Fail fast on broken cross-references before touching the database.
function validateReferences() {
  const codes = new Set();
  for (const h of hospitalData) {
    if (codes.has(h.hospital_id)) throw new Error(`Duplicate hospital_id "${h.hospital_id}" in data/hospitals.json`);
    codes.add(h.hospital_id);
  }
  const unknown = (code) => !codes.has(code);
  for (const hotel of hotelData) {
    if (unknown(hotel.hospital)) {
      throw new Error(`Hotel "${hotel.hotel_id}" in data/hotels.json references unknown hospital code "${hotel.hospital}"`);
    }
  }
  for (const t of treatmentData) {
    if (!Array.isArray(t.hospitals) || t.hospitals.length === 0) {
      throw new Error(`Treatment "${t.treatment_id}" in data/treatments.json has no hospitals`);
    }
    const bad = t.hospitals.filter(unknown);
    if (bad.length) {
      throw new Error(`Treatment "${t.treatment_id}" in data/treatments.json references unknown hospital code(s): ${bad.join(", ")}`);
    }
  }
}

async function upsertUser({ email, password }, extra) {
  const hashed = await hashPassword(password);
  await User.findOneAndUpdate(
    { email },
    { $set: { email, password: hashed, ...extra } },
    { upsert: true, setDefaultsOnInsert: true }
  );
}

async function seed() {
  validateReferences();
  await mongoose.connect(process.env.MONGO_DB_URL);

  await Promise.all([Hospital, Treatment, Hotel, Insurance, PostTreatment, Application, PostCareForm].map((m) => m.deleteMany({})));

  // `city` is only used for grouping in the JSON; Mongoose strict mode drops it.
  const hospitals = await Hospital.insertMany(hospitalData);
  const hospitalByCode = Object.fromEntries(hospitals.map((h) => [h.hospital_id, h]));

  const hotels = await Hotel.insertMany(
    hotelData.map(({ hospital: code, ...h }) => ({
      ...h,
      hospital_id: hospitalByCode[code]._id,
      hospital_nearby: [hospitalByCode[code].hospital_name],
    }))
  );
  await Promise.all(
    hospitals.map((hospital) => {
      hospital.Hotels = hotels.filter((h) => h.hospital_id.equals(hospital._id)).map((h) => h._id);
      return hospital.save();
    })
  );

  const treatments = await Treatment.insertMany(
    treatmentData.map(({ hospitals: codes, ...t }) => ({
      ...TREATMENT_CONTACT,
      ...t,
      available_hospitals: codes.map((c) => hospitalByCode[c]._id),
    }))
  );

  await Insurance.insertMany(insuranceData);
  await PostTreatment.insertMany(postTreatmentData);

  await User.deleteMany({ email: { $in: LEGACY_DEMO_EMAILS } });
  await upsertUser(DEMO_ADMIN, { fullName: "MedNdi Admin", role: "Admin", age: 35, height: 175, weight: 72, gender: "Male" });
  await upsertUser(DEMO_PATIENT, { fullName: "Demo Patient", role: "User", age: 42, height: 168, weight: 70, gender: "Female", nationality: "Kenyan" });

  const perCity = hospitalData.reduce((acc, h) => ({ ...acc, [h.city || "Other"]: (acc[h.city || "Other"] || 0) + 1 }), {});
  console.log(
    `Seeded ${hospitals.length} hospitals (${Object.entries(perCity).map(([c, n]) => `${c}: ${n}`).join(", ")}), ` +
      `${hotels.length} hotels, ${treatments.length} treatments, ${insuranceData.length} insurance plans, ${postTreatmentData.length} post-treatment services.`
  );
  console.log(`Admin:   ${DEMO_ADMIN.email} / ${DEMO_ADMIN.password}`);
  console.log(`Patient: ${DEMO_PATIENT.email} / ${DEMO_PATIENT.password}`);
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
