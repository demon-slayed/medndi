import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { 
  Facebook, Twitter, Instagram, Linkedin,
  MapPin, Phone, Mail, ArrowUpRight,
  Shield, Award, Heart
} from 'lucide-react';
import MedNdiLogo from '@/assets/icons/MedNdiLogo';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate()
  const handleClickGetFreeConsultation = ()=>{
       navigate('/contact');
  }
  const forPatients = [
    { name: "Find Hospitals", link: "/hospitals" },
    { name: "Browse Treatments", link: "/treatments" },
    { name: "Patient Portal", link: "/patient" },
    { name: "About MedNDI", link: "/about" },
    { name: "Contact Support", link: "/contact" }
  ];

  const treatments = [
    { name: "Orthopedic Care", link: "/treatments?q=Orthopedics" },
    { name: "Cardiac Procedures", link: "/treatments?q=Cardiology" },
    { name: "Cancer Treatment", link: "/treatments?q=Oncology" },
    { name: "Fertility (IVF)", link: "/treatments?q=Fertility" },
    { name: "View All Treatments", link: "/treatments" }
  ];

  const contactInfo = [
    { icon: Phone, info: "+91 1800 123 4567", label: "24/7 Support" },
    { icon: Mail, info: "info@medndi.com", label: "Email Us" },
    { icon: MapPin, info: "New Delhi, India", label: "Head Office" }
  ];

  return (
    <div className="relative bg-gradient-to-b from-white to-blue-50">
      {/* Top Border Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3252DF] to-[#4466ff]" />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 ">
          {/* Brand Column */}
          <div className="space-y-6 max-sm:flex max-sm:flex-col max-sm:items-center max-sm:text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <MedNdiLogo textColor="#152C5B" tagColor="#3252DF" accentColor="#fff" />
              <p className="mt-6 text-gray-600 leading-relaxed">
                Helping international patients find and plan quality treatment at accredited hospitals in Delhi NCR, Bengaluru and Pune.
              </p>
            </motion.div>

            {/* Accreditations */}
            <div className="flex flex-wrap items-center gap-4 max-sm:text-center max-sm:justify-center">
              <div className="flex items-center gap-2 text-[#3252DF]">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">JCI / NABH hospitals</span>
              </div>
              <div className="flex items-center gap-2 text-[#3252DF]">
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium">Upfront ₹ estimates</span>
              </div>
            </div>

            {/* Social Links (decorative until real profiles exist) */}
            <div className="flex items-center gap-4 max-sm:text-center max-sm:justify-center" aria-hidden="true">
              {[Twitter, Facebook, Instagram, Linkedin].map((Icon, idx) => (
                <span
                  key={idx}
                  className="p-2 rounded-full bg-blue-50 text-[#3252DF]"
                >
                  <Icon className="w-5 h-5" />
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links Columns */}
          <div className="space-y-6 max-sm:text-center max-sm:justify-center">
            <h3 className="text-lg font-semibold text-gray-900">For Patients</h3>
            <ul className="space-y-4 flex flex-col max-sm:items-center">
              {forPatients.map((item, idx) => (
                <motion.li
                  key={idx}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 group"
                >
                  <Heart className="w-4 h-4 text-[#3252DF] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Link to={item.link} className="text-gray-600 hover:text-[#3252DF] transition-colors">
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 max-sm:text-center">Treatments</h3>
            <ul className="space-y-4 flex flex-col max-sm:items-center">
              {treatments.map((item, idx) => (
                <motion.li
                  key={idx}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 group"
                >
                  <Heart className="w-4 h-4 text-[#3252DF] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Link key={idx} to={item.link} className="text-gray-600 hover:text-[#3252DF] transition-colors">
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 max-sm:text-center">Contact Us</h3>
            <div className="space-y-4 flex flex-col max-sm:items-center">
              {contactInfo.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-blue-50 text-[#3252DF]">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.info}</p>
                    <p className="text-sm text-gray-500">{item.label}</p>
                  </div>
                </motion.div>
              ))}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 w-full py-3 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
                onClick={handleClickGetFreeConsultation}
              >
                Get Free Consultation
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4 max-sm:justify-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} MedNDI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/about" className="text-sm text-gray-600 hover:text-[#3252DF]">About Us</Link>
              <Link to="/contact" className="text-sm text-gray-600 hover:text-[#3252DF]">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;