import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import EarthIcon from "@/assets/icons/EarthIcon";
import HospitalIcon from "@/assets/icons/HospitalIcon";
import HandIcon from "@/assets/icons/HandIcon";
import QuickBookCTA from "@/components/QuickBookCTA";
import { motion } from "framer-motion";
import { ChevronRight, Star } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import useAppStore from "@/store/useAppStore";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Enhanced floating animation
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

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

  // handleClickExploreServices
  const handleClickExploreServices = () => {
    window.scrollTo(0,0);
    navigate('/treatments')
  }

  const handleClickeLarnMore = () => {
    window.scrollTo(0,0);
    navigate('/contact')
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative bg-gradient-to-b from-[#ECF1FF] to-white overflow-hidden min-h-screen">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20 -top-20 -left-20 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 -bottom-20 -right-20 animate-pulse" />
        <div className="absolute w-64 h-64 bg-pink-200 rounded-full filter blur-3xl opacity-10 top-1/2 left-1/3 animate-pulse" />
      </div>

      {/* Trust Badges */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 max-sm:w-max max-sm:mt-3 max-sm:px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 flex items-center gap-4 shadow-sm "
        >
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 max-md:hidden" />
            <span className="text-sm font-medium text-gray-700 max-sm:text-xs">4.9/5 Rating</span>
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <span className="text-sm font-medium text-gray-700 max-sm:text-xs max-sm:mx-auto">10,000+ Successful Treatments</span>
        </motion.div>
      </div>

      <div className="relative px-6 md:px-20 lg:pl-40 lg:pr-24 py-10 md:py-16 lg:py-24 mt-12 " style={glowingBg}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          {/* Enhanced Left Section */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
            className="flex flex-1 flex-col gap-8 md:gap-10 text-center md:text-left"
          >
            <div className="flex flex-col gap-8 lg:gap-4 max-sm:p-5 max-lg:items-center max-lg:text-center">
              <motion.div
                variants={textReveal}
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm w-fit rounded-full px-4 py-2 mb-4 max-lg:self-center"
              >
                <span className="text-sm font-medium bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">
                  Healthcare Without Borders
                </span>
                <ChevronRight className="w-4 h-4 text-blue-600" />
              </motion.div>

              <motion.h2 
                variants={textReveal}
                className="font-poppins font-bold max-sm:text-3xl text-4xl max-lg:text-5xl lg:text-6xl leading-tight text-[#152C5B] tracking-tight"
              >
                Discover Top Healthcare
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"> Abroad </span>
                Plan Your Trip!
              </motion.h2>
              
              <motion.p 
                variants={textReveal}
                className="font-poppins max-sm:text-sm text-base lg:text-lg leading-relaxed text-gray-600 w-full md:w-[70%]"
              >
                We provide what you need to enjoy your healthcare trip. Time to
                make quality healthcare accessible and affordable abroad.
              </motion.p>
            </div>

            <motion.div
              variants={textReveal}
              className="flex gap-4 max-lg:justify-center max-sm:px-5"
            >
              <Button 
                className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white font-poppins font-medium text-base max-sm:text-sm md:text-lg px-8 py-6 max-sm:px-6 max-sm:py-5  rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                onClick={handleClickExploreServices}
              >
                Explore Services
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-[#3252DF] text-[#3252DF] font-poppins font-medium text-base max-sm:text-sm  md:text-lg px-8 py-6 max-sm:px-6 max-sm:py-5 rounded-xl hover:bg-blue-50 transition-all duration-300"
                onClick={handleClickeLarnMore}
              >
                Learn More
              </Button>
            </motion.div>

            {/* Enhanced Stats Section */}
            <motion.div 
              variants={textReveal}
              className="flex justify-evenly lg:justify-start mt-6 md:mt-9 w-full gap-8 max-sm:px-10 max-sm:flex-wrap"
            >
              {[
                { Icon: HandIcon, count: "2500", label: "Happy Users" },
                { Icon: EarthIcon, count: "20", label: "Countries" },
                { Icon: HospitalIcon, count: "100", label: "Top Hospitals" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  animate={floatingAnimation}
                  className="flex flex-col gap-3 items-center md:items-start group cursor-pointer bg-white/50 backdrop-blur-sm rounded-xl p-4 hover:bg-white/80 transition-all duration-300 max-lg:self-center"
                >
                  <div className="transform transition-transform group-hover:scale-110 duration-300">
                    <stat.Icon />
                  </div>
                  <p className="font-poppins text-gray-600 font-medium text-sm md:text-base">
                    <span className="text-[#152C5B] font-bold">{stat.count}</span>
                    <br/>{stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced Right Section (Image) */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 relative md:mt-0 max-lg:hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse" />
            <img
              src="/assets/herosectionimg.png"
              alt="hero-section-img"
              className="relative lg:w-[100%] lg:scale-[1.2] lg:h-[450px] lg:object-scale-down hover:scale-105 transition-transform duration-500 w-full h-auto"
            />
          </motion.div>
        </div>
      </div>

      {/* Quick Book CTA Component */}
      <QuickBookCTA />
    </div>
  );
};

export default Hero;