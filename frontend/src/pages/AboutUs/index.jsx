// AboutUs.js
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout/Layout";
import PageHeader from "@/components/PageHeader";
import {
  Stethoscope,
  UserCheck,
  Plane,
  Award,
  Clock,
  Shield,
  HeartPulse,
  BadgeCheck,
  Users2,
} from "lucide-react";
import { motion } from "framer-motion";

const AboutUs = () => {
  const features = [
    {
      icon: <Stethoscope className="w-8 h-8 text-blue-600" />,
      title: "Expert Medical Care",
      description:
        "Specialists at leading hospitals in Delhi NCR, Bengaluru and Pune, with treatment plans reviewed before you travel.",
    },
    {
      icon: <Plane className="w-8 h-8 text-blue-600" />,
      title: "Complete Travel Support",
      description:
        "Seamless travel arrangements including visa assistance and airport transfers.",
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Quality Assurance",
      description:
        "We list only JCI and/or NABH-accredited hospitals, with doctors, facilities and indicative ₹ costs shown upfront.",
    },
  ];

  const stats = [
    {
      icon: <UserCheck className="w-6 h-6 text-blue-600" />,
      value: "3 cities",
      label: "Delhi NCR, Bengaluru & Pune",
    },
    {
      icon: <Award className="w-6 h-6 text-blue-600" />,
      value: "JCI / NABH",
      label: "Accredited partner hospitals",
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      value: "24/7",
      label: "Patient coordinator support",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const hoverVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <PageHeader
            eyebrow="About MedNdi"
            title="Your bridge to quality treatment in India"
            subtitle="MedNdi helps international patients compare accredited hospitals in Delhi NCR, Bengaluru and Pune, understand costs upfront, and plan every step of the trip with one coordinator."
          />

          {/* About Section */}
          {/* <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/assets/hospital1.png"; }}
                      alt="Medical team"
                      className="rounded-lg shadow-lg w-full h-[300px] object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-4 text-lg font-poppins">
                       <span className=' text-[#3552DF] text-2xl'>MedNdi Medical Tourism</span> has been at the forefront of revolutionizing healthcare tourism in India. We bridge the gap between international patients and India's premier medical facilities.
                    </p>
                    <p className="text-gray-600">
                      Our mission is to provide seamless medical tourism experiences by combining cutting-edge medical treatments with comprehensive patient care services.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div> */}

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover="hover"
                variants={hoverVariants}
              >
                <Card className="h-full rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <motion.div
                        className="mb-4"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-16 overflow-hidden"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                alt=""
                aria-hidden="true"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
                className="w-full h-full object-cover opacity-5"
              />
            </div>
            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex flex-col items-center text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.span
                    className="text-2xl md:text-3xl font-bold text-[#152C5B] mt-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    {stat.value}
                  </motion.span>
                  <span className="text-gray-600">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Why Choose Us Section */}
          {/* Why Choose Us Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-[#283841] mb-8 text-center">
              Why Choose MedNdi
            </h2>

            <div className="flex flex-wrap gap-6 justify-center">
              {/* Card 1 */}
              <motion.div
                variants={itemVariants}
                className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)]"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full rounded-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-48">
                      <img
                        src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/assets/hospital1.png"; }}
                        alt="Medical Excellence"
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        <BadgeCheck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            Medical Excellence
                          </h3>
                          <p className="text-gray-600">
                            Access to JCI and NABH-accredited hospitals and
                            experienced specialists across our three
                            partner cities.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                variants={itemVariants}
                className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)]"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full rounded-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-48">
                      <img
                        src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/assets/hospital1.png"; }}
                        alt="Personalized Care"
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        <HeartPulse className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            Personalized Care
                          </h3>
                          <p className="text-gray-600">
                            Dedicated patient coordinators available 24/7,
                            providing comprehensive support throughout your
                            medical journey.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                variants={itemVariants}
                className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)]"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full rounded-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-48">
                      <img
                        src="https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/assets/hospital1.png"; }}
                        alt="Advanced Facilities"
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        <Award className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            Advanced Facilities
                          </h3>
                          <p className="text-gray-600">
                            State-of-the-art medical facilities equipped with
                            the latest technology and modern amenities for
                            optimal care.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
