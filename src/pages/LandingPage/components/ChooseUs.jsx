import React from 'react';
import { motion } from 'framer-motion';
import Talk from '@/assets/icons/Talk';
import Transform from '@/assets/icons/Transform';
import Travel from '@/assets/icons/Travel';
import { MessageCircle, Plane, Activity, Users, Calendar, CheckCircle2 } from 'lucide-react';

const features = [
  {
    id: 1,
    icon: <Talk />,
    about: "Expert Consultation",
    desc: "Get personalized treatment plans from leading healthcare specialists worldwide",
    stats: { consultations: "50k+", satisfaction: "98%" },
    benefits: ["24/7 Expert Support", "Video Consultations", "Detailed Reports"]
  },
  {
    id: 2,
    icon: <Travel />,
    about: "Smart Travel Planning",
    desc: "Seamless travel arrangements with dedicated support throughout your journey",
    stats: { destinations: "100+", arrangements: "10k+" },
    benefits: ["Visa Assistance", "Local Transport", "Accommodation"]
  },
  {
    id: 3,
    icon: <Transform />,
    about: "Quality Treatment",
    desc: "World-class medical care with comprehensive post-treatment support",
    stats: { success: "99%", followups: "30k+" },
    benefits: ["Top Specialists", "Modern Facilities", "Recovery Support"]
  }
];

const ChooseUs = () => {
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
          className="text-center mb-20"
        >
          <h2 className="font-poppins font-bold text-5xl mb-4">
            Why{" "}
            <span className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">
              Choose Us
            </span>
          </h2>
          <p className="font-dmsans text-lg text-gray-600 max-w-2xl mx-auto">
            Experience excellence in global healthcare with our comprehensive support system
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {[
            { icon: Users, label: "Happy Patients", value: "50k+" },
            { icon: Calendar, label: "Years Experience", value: "15+" },
            { icon: CheckCircle2, label: "Success Rate", value: "99%" },
            { icon: MessageCircle, label: "Expert Doctors", value: "500+" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white rounded-xl shadow-lg"
            >
              <stat.icon className="w-8 h-8 text-[#3252DF] mx-auto mb-3" />
              <p className="font-bold text-2xl text-[#152C5B] mb-1">{stat.value}</p>
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
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
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
                    <p className="text-sm text-gray-600 capitalize">{key}</p>
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
    </div>
  );
};

export default ChooseUs;