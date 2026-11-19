import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Stethoscope, Headphones } from 'lucide-react';

// Hospital groups whose facilities are listed on MedNdi
const partners = [
  "Apollo Hospitals",
  "Medanta",
  "Max Healthcare",
  "Fortis Healthcare",
  "Manipal Hospitals",
  "Narayana Health",
  "Aster CMI",
  "Ruby Hall Clinic",
];

const networkStats = [
  { icon: MapPin, label: "Cities: Delhi NCR, Bengaluru, Pune", value: "3 cities" },
  { icon: Building2, label: "Accredited hospitals", value: "JCI / NABH" },
  { icon: Stethoscope, label: "Treatments with upfront estimates", value: "12+" },
  { icon: Headphones, label: "Patient coordinator support", value: "24/7" },
];

const OurPartners = () => {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30 -top-20 -left-20" />
        <div className="absolute w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30 -bottom-20 -right-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-[#283841]">
            Our Hospital{" "}
            <span className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">
              Network
            </span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Leading Indian hospital groups across Delhi NCR, Bengaluru and Pune, all listed with
            doctors, facilities and indicative prices in ₹.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
        >
          {networkStats.map((stat) => (
            <div key={stat.label} className="text-center p-4 md:p-6 bg-white rounded-2xl shadow-lg">
              <stat.icon className="w-7 h-7 text-[#3252DF] mx-auto mb-2" />
              <p className="font-bold text-xl md:text-2xl text-[#152C5B]">{stat.value}</p>
              <p className="text-gray-600 text-xs md:text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {partners.map((name) => (
            <li
              key={name}
              className="flex items-center justify-center gap-2 h-20 px-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-center"
            >
              <Building2 className="w-5 h-5 text-[#3252DF] shrink-0 max-sm:hidden" />
              <span className="font-poppins font-semibold text-sm md:text-base text-[#152C5B]">{name}</span>
            </li>
          ))}
        </motion.ul>
        <p className="mt-6 text-center text-xs text-gray-500">
          Hospital names are shown to identify facilities listed on MedNdi.
        </p>
      </div>
    </section>
  );
};

export default OurPartners;
