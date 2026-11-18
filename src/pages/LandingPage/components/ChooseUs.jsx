import React from 'react';
import { motion } from 'framer-motion';
import Talk from '@/assets/icons/Talk';
import Transform from '@/assets/icons/Transform';
import Travel from '@/assets/icons/Travel';
import { MessageCircle, MapPin, Users, CheckCircle2 } from 'lucide-react';

const features = [
  {
    id: 1,
    icon: <Talk />,
    about: "Expert Consultation",
    desc: "Share your reports and get a treatment plan and cost estimate from specialists at accredited Indian hospitals.",
    stats: { "reply within": "48 hrs", "opinion fee": "Free" },
    benefits: ["Second opinions on your reports", "Video consultations", "Transparent ₹ estimates"]
  },
  {
    id: 2,
    icon: <Travel />,
    about: "Travel Planning",
    desc: "One coordinator handles your medical visa letter, airport pickup and a stay near the hospital.",
    stats: { cities: "3", "hotels per hospital": "4–5" },
    benefits: ["Medical visa invitation letter", "Airport pickup & local transport", "Hotels near your hospital"]
  },
  {
    id: 3,
    icon: <Transform />,
    about: "Quality Treatment",
    desc: "Treatment at JCI / NABH-accredited hospitals, with follow-up support after you return home.",
    stats: { accreditation: "JCI / NABH", "follow-up": "Video" },
    benefits: ["Experienced specialists", "Modern facilities", "Post-care support"]
  }
];

const ChooseUs = () => {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30 -top-20 -left-20 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30 -bottom-20 -right-20 animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-[#283841] mb-4">
            Why{" "}
            <span className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">
              Choose Us
            </span>
          </h2>
          <p className="font-dmsans text-lg text-gray-600 max-w-2xl mx-auto">
            Quality treatment in India, planned end to end by one team, from your first report to your flight home
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12"
        >
          {[
            { icon: MapPin, label: "Partner cities", value: "3" },
            { icon: Users, label: "Dedicated coordinator", value: "1:1" },
            { icon: CheckCircle2, label: "Accredited hospitals", value: "JCI / NABH" },
            { icon: MessageCircle, label: "Patient support", value: "24/7" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="text-center p-4 md:p-6 bg-white rounded-2xl shadow-lg"
            >
              <stat.icon className="w-8 h-8 text-[#3252DF] mx-auto mb-3" />
              <p className="font-bold text-xl md:text-2xl text-[#152C5B] mb-1">{stat.value}</p>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 mb-6 mx-auto"
              >
                {feature.icon}
              </motion.div>

              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="font-inter font-bold text-2xl text-[#152C5B] mb-3">
                  {feature.about}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>

              {/* Stats */}
              <div className="flex justify-around mb-6">
                {Object.entries(feature.stats).map(([key, value], idx) => (
                  <div key={idx} className="text-center">
                    <p className="font-bold text-xl text-[#3252DF]">{value}</p>
                    <p className="text-xs text-gray-600 capitalize">{key}</p>
                  </div>
                ))}
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ChooseUs;