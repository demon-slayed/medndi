import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AppoloHospital from '@/assets/icons/AppoloHospital';
import Hcahealthcare from '@/assets/icons/Hcahealthcare';
import Medanta from '@/assets/icons/Medanta';
import UnttedHealthCare from '@/assets/icons/UnitedHealthCare';
import MaxHealthCare from '@/assets/icons/MaxHealthCare';
import { Building2, Award, Users, Globe } from 'lucide-react';

const partners = [
  {
    Icon: Hcahealthcare,
    name: "HCA Healthcare",
    stats: { hospitals: "2000+", patients: "35M+", countries: "20+" }
  },
  {
    Icon: AppoloHospital,
    name: "Apollo Hospitals",
    stats: { hospitals: "70+", patients: "45M+", countries: "10+" }
  },
  {
    Icon: Medanta,
    name: "Medanta",
    stats: { hospitals: "30+", patients: "20M+", countries: "5+" }
  },
  {
    Icon: UnttedHealthCare,
    name: "United Healthcare",
    stats: { hospitals: "1000+", patients: "50M+", countries: "15+" }
  },
  {
    Icon: MaxHealthCare,
    name: "Max Healthcare",
    stats: { hospitals: "40+", patients: "25M+", countries: "8+" }
  }
];

const OurPartners = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="relative overflow-hidden py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30 -top-20 -left-20 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30 -bottom-20 -right-20 animate-pulse" />
      </div>

      <div className="relative px-6 md:px-16 lg:px-40">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-inter font-semibold text-4xl mb-4 bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">
            Our Global Partners
          </h2>
          <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
            Collaborating with world-class healthcare institutions to deliver exceptional medical care
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {[
            { icon: Building2, label: "Partner Hospitals", value: "3000+" },
            { icon: Users, label: "Patients Served", value: "175M+" },
            { icon: Globe, label: "Countries", value: "50+" },
            { icon: Award, label: "Awards", value: "200+" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-2"
              >
                <stat.icon className="w-8 h-8 text-[#3252DF]" />
                <p className="font-semibold text-2xl text-[#152C5B]">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* Partners Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex justify-center items-center h-24">
                  <partner.Icon />
                </div>

                {/* Hover Stats */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    y: hoveredIndex === index ? 0 : 10
                  }}
                  className="absolute inset-0 bg-gradient-to-b from-[#3252DF]/95 to-[#4466ff]/95 rounded-xl p-6 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-300"
                >
                  <h3 className="font-semibold text-lg mb-4">{partner.name}</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {partner.stats.hospitals} Hospitals
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {partner.stats.patients} Patients
                    </p>
                    <p className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {partner.stats.countries} Countries
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default OurPartners;