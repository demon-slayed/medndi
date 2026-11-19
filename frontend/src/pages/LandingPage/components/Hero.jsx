import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import EarthIcon from "@/assets/icons/EarthIcon";
import HospitalIcon from "@/assets/icons/HospitalIcon";
import HandIcon from "@/assets/icons/HandIcon";
import QuickBookCTA from "@/components/QuickBookCTA";
import { motion } from "framer-motion";
import { MapPin, Search, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Text reveal animation
  const textReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  // Enhanced glowing background effect
  const glowingBg = {
    background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(50, 82, 223, 0.15), transparent 40%)`,
  };

  const handleClickFindTreatment = () => {
    window.scrollTo(0,0);
    navigate('/treatments')
  }

  const handleClickExploreHospitals = () => {
    window.scrollTo(0,0);
    navigate('/hospitals')
  }

  const topCities = [
    { label: "Delhi NCR", q: "Delhi NCR" },
    { label: "Bengaluru", q: "Bengaluru" },
    { label: "Pune", q: "Pune" },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-[#ECF1FF] to-white overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        <div className="absolute w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20 -top-20 -left-20 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 -bottom-20 -right-20 animate-pulse" />
        <div className="absolute w-64 h-64 bg-pink-200 rounded-full filter blur-3xl opacity-10 top-1/2 left-1/3 animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-16 md:pt-14 md:pb-20 lg:pt-16 lg:pb-24" style={glowingBg}>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
          {/* Left Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="flex flex-1 flex-col gap-8 text-center lg:text-left items-center lg:items-start"
          >
            <motion.div
              variants={textReveal}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm w-fit rounded-full px-4 py-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-[#3252DF]" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                JCI / NABH-accredited hospitals · Prices in ₹
              </span>
            </motion.div>

            <div className="flex flex-col gap-4">
              <motion.h1
                variants={textReveal}
                className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight text-[#152C5B] tracking-tight"
              >
                Quality treatment in{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3252DF] to-purple-600">India</span>,
                planned end to end
              </motion.h1>

              <motion.p
                variants={textReveal}
                className="font-poppins text-sm sm:text-base lg:text-lg leading-relaxed text-gray-600 max-w-xl mx-auto lg:mx-0"
              >
                Compare accredited hospitals in Delhi NCR, Bengaluru and Pune, see
                indicative costs upfront, and let one coordinator arrange your visa
                letter, travel and stay.
              </motion.p>
            </div>

            <motion.div
              variants={textReveal}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
            >
              <Button
                variant="brand"
                size="xl"
                className="font-poppins px-8"
                onClick={handleClickFindTreatment}
              >
                <Search className="w-5 h-5" />
                Find a treatment
              </Button>
              <Button
                variant="brandOutline"
                size="xl"
                className="font-poppins px-8"
                onClick={handleClickExploreHospitals}
              >
                Explore hospitals
              </Button>
            </motion.div>

            {/* Top cities */}
            <motion.div
              variants={textReveal}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-2 text-sm"
            >
              <span className="flex items-center gap-1 font-medium text-gray-700">
                <MapPin className="w-4 h-4 text-[#3252DF]" />
                Top cities:
              </span>
              {topCities.map((city, idx) => (
                <React.Fragment key={city.label}>
                  {idx > 0 && <span className="text-gray-300" aria-hidden="true">·</span>}
                  <Link
                    to={`/hospitals?q=${encodeURIComponent(city.q)}`}
                    className="font-medium text-[#3252DF] hover:underline underline-offset-4 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40"
                  >
                    {city.label}
                  </Link>
                </React.Fragment>
              ))}
            </motion.div>

            {/* What we handle */}
            <motion.ul
              variants={textReveal}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl lg:max-w-none"
            >
              {[
                { Icon: HospitalIcon, label: "Accredited hospitals" },
                { Icon: EarthIcon, label: "Visa & travel help" },
                { Icon: HandIcon, label: "One dedicated coordinator" }
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm text-left"
                >
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full">
                    <item.Icon />
                  </div>
                  <span className="font-poppins text-sm font-medium text-[#152C5B]">{item.label}</span>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right Section (Image) */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 relative max-lg:hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full filter blur-3xl opacity-20" />
            <img
              src="/assets/herosectionimg.png"
              alt="Patient consulting a doctor"
              className="relative w-full h-[450px] object-contain"
            />
          </motion.div>
        </div>
      </div>

      {/* Quick Book CTA Component */}
      <QuickBookCTA />
    </section>
  );
};

export default Hero;