// AboutUs.js
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout/Layout";
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
        "Access to India's top medical professionals and cutting-edge treatments.",
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
        "Partnerships with JCI-accredited hospitals and internationally recognized facilities.",
    },
  ];

  const stats = [
    {
      icon: <UserCheck className="w-6 h-6 text-blue-600" />,
      value: "5000+",
      label: "Happy Patients",
    },
    {
      icon: <Award className="w-6 h-6 text-blue-600" />,
      value: "50+",
      label: "Partner Hospitals",
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      value: "24/7",
      label: "Support Available",
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
      <div className=" bg-gray-50 mt-20">
        {/* Hero Section with Gradient Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative text-white"
          style={{
            background: "linear-gradient(to right, #000428, #004e92)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="Modern hospital facility"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="relative container mx-auto px-4 py-16 md:py-20">
            {" "}
            {/* Reduced padding */}
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold mb-4 text-center"
            >
              Welcome to Arogini Medical Tourism
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-center max-w-2xl mx-auto"
            >
              Your bridge to world-class healthcare in India
            </motion.p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
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
                      alt="Medical team"
                      className="rounded-lg shadow-lg w-full h-[300px] object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-4 text-lg font-poppins">
                       <span className=' text-[#3552DF] text-2xl'>Arogini Medical Tourism</span> has been at the forefront of revolutionizing healthcare tourism in India. We bridge the gap between international patients and India's premier medical facilities.
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
                <Card className="h-full">
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
            className="relative bg-white rounded-lg shadow-lg p-8 mb-16 overflow-hidden"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                alt="Medical background"
                className="w-full h-full object-cover opacity-5"
              />
            </div>
            <div className="relative grid md:grid-cols-3 gap-8">
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
                    className="text-3xl font-bold mt-2"
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
            <h2 className="text-3xl font-bold mb-8 text-center">
              Why Choose Arogini
            </h2>

            <div className="flex flex-wrap gap-6 justify-center">
              {/* Card 1 */}
              <motion.div
                variants={itemVariants}
                className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] min-w-[280px]"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full">
                  <CardContent className="p-0">
                    <div className="relative h-48">
                      <img
                        src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
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
                            Access to JCI-accredited hospitals and
                            internationally trained medical professionals
                            ensuring world-class treatment standards.
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
                className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] min-w-[280px]"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full">
                  <CardContent className="p-0">
                    <div className="relative h-48">
                      <img
                        src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
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
                className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] min-w-[280px]"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full">
                  <CardContent className="p-0">
                    <div className="relative h-48">
                      <img
                        src="https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
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
