import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, Heart, Activity, Search, Phone, ChevronDown, 
  Stethoscope, User, Lock, HelpCircle, Hospital, LogOut
} from "lucide-react";
import AroginiLogo from '@/assets/icons/Aroginilogo';
import logo from '@/assets/logo.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from "react-router-dom";
import useAppStore from '@/store/useAppStore';
import toast from 'react-hot-toast';
import axios from 'axios';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const { auth, setAuth, setRedirectPath } = useAppStore();
  const navigate = useNavigate();
  let timeoutId = null;
  const profileMenuRef = useRef(null);

  const handleDoctorLogin = ()=>{
    console.log("auth is: ", auth);
    
       if(auth?.role==='Admin'){
        navigate('/admin-dashboard');
       } else{
         toast.error("Only Admins Route!")
       }
  }
  const handleClickLogo = () => {
    window.scrollTo(0,0);
    navigate('/');
  }

  const handleLoginClick = ()=>{
        setRedirectPath(location?.pathname);
        navigate('/login');
  }

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/users/logout`, {}, { withCredentials: true });
      setAuth(null);
      navigate('/');
    } catch (err) {
      console.error("Logout error", err);
      toast.error("Failed to log out");
    }
  };
  

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);

  const navigationItems = [
    {
      label: "Treatments",
      icon: Stethoscope,
      path: "/treatments",
      subItems: [
        { label: "Bariatric Surgery", path: "/treatments/bariatric" },
        { label: "Orthopedic", path: "/treatments/orthopedic" },
        { label: "Cardiology", path: "/treatments/cardiology" },
        { label: "View All Treatments", path: "/treatments/all" }
      ]
    },
    {
      label: "Hospitals",
      icon: Hospital,
      path: "/hospitals",
      subItems: [
        { label: "Top Hospitals", path: "/hospitals/top" },
        { label: "Compare Hospitals", path: "/hospitals/compare" },
        { label: "Hospital Network", path: "/hospitals/network" }
      ]
    },
    {
      label: "For Patients",
      icon: Heart,
      path: "/patient",
      subItems: [
        { label: "Patient Journey", path: "/patients/journey" },
        { label: "Success Stories", path: "/patients/stories" },
        { label: "Insurance", path: "/patients/insurance" }
      ]
    },
    { label: "About Us", icon: User, path: "/about" },
    { label: "Contact", icon: Phone, path: "/contact" }
  ];

  const DropdownMenu = ({ item }) => (
    <AnimatePresence>
      {hoveredItem === item.label && item.subItems && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl py-3 mt-2 z-50"
        >
          {item.subItems.map((subItem, idx) => (
            <motion.div
              key={idx}
              whileHover={{ x: 5, backgroundColor: '#f3f4f6' }}
              className="px-4 py-2"
            >
              <Link
                to={subItem.path}
                className="flex items-center gap-2 text-gray-700 hover:text-[#3252DF]"
              >
                {subItem.label}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full top-0 left-0 z-[100] shadow-lg"
    >
      {/* Top Bar */}
      <div className="bg-[#242d90] text-white py-1">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4 max-sm:text-xs" /> +1 (800) 123-4567
            </span>
            <span className="hidden md:flex items-center gap-1">
              <Activity className="w-4 h-4" /> 24/7 Support
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:text-blue-200 transition-colors max-sm:text-xs" onClick={()=>{navigate('/patient')}}>Patient Portal</button>
            <button className="hover:text-blue-200 transition-colors max-sm:text-xs" onClick={()=>{handleDoctorLogin()}}>Doctor Login</button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-[#0d1230] border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 py-2 ">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 flex items-center gap-0"
            >
              <img src={logo} alt="logo.png" className="h-16 w-16 max-sm:w-16 max-sm:h-16" />
              <AroginiLogo className="cursor-pointer p-0 -ml-3" onClick={handleClickLogo}/>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigationItems.map((item, idx) => (
                <div
                  key={idx}
                  className="relative group"
                  onMouseEnter={() => {
                    clearTimeout(timeoutId);
                    setHoveredItem(item.label);
                  }}
                  onMouseLeave={() => {
                    timeoutId = setTimeout(() => {
                      setHoveredItem(null);
                    }, 200);
                  }}
                >
                  <div className="relative cursor-pointer hover:no-underline" onClick={() => { navigate(item.path); window.scrollTo(0, 0); }}>
                    <motion.div whileHover={{ y: -2 }} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-blue-300" />
                      <span className="text-gray-100 font-medium hover:text-white transition-colors [text-decoration:none] hover:[text-decoration:none]">
                        {item.label}
                      </span>
                      {item.subItems && <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </motion.div>
                  </div>

                  {item.subItems && hoveredItem === item.label && (
                    <div className="absolute left-0 top-full pt-2 min-w-[200px] shadow-lg rounded-lg">
                      <DropdownMenu item={item} />
                    </div>
                  )}
                </div>
              ))}
            </nav>
            {/* Action Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-blue-900/50 text-blue-200 hover:bg-blue-900 transition-colors"
              >
                <Search className="w-5 h-5" onClick={()=>{navigate('/treatments')}}/>
              </motion.button>

              {/* Conditional rendering based on auth state */}
              {auth && auth.length !== 0 ? (
                <div className="relative" ref={profileMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="p-2 rounded-full bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white flex items-center justify-center"
                  >
                    <User className="w-5 h-5" />
                  </motion.button>
                  
                  {/* Profile dropdown menu */}
                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-3 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="font-medium text-gray-800">{auth.fullName}</div>
                          <div className="text-sm text-gray-500 truncate">{auth.email}</div>
                        </div>
                        <div className="mt-2">
                          <motion.button
                            whileHover={{ x: 5, backgroundColor: '#f3f4f6' }}
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 w-full text-left text-gray-700 hover:text-red-500"
                          >
                            <LogOut className="w-4 h-4" />
                            Log out
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  {/* sign in button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLoginClick()}
                    className="px-4 py-2 border-2 border-blue-400 text-blue-200 rounded-lg font-medium hover:bg-blue-900/50 transition-colors"
                  >
                    Sign In
                  </motion.button>

                  {/* register button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    Register Now
                  </motion.button>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-blue-300 hover:text-blue-200"
                  >
                    <Menu size={28} />
                  </motion.button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-[#0c1445] border-r border-blue-900">
                  <div className="py-6">
                    <div className="mb-8">
                      <AroginiLogo />
                    </div>
                    <nav className="space-y-6">
                      {navigationItems.map((item, idx) => (
                        <div key={idx} className="space-y-2" onClick={()=>{navigate(item.path)}}>
                          <div className="flex items-center gap-2 text-gray-100 font-medium">
                            <item.icon className="w-5 h-5 text-blue-300" />
                            {item.label}
                          </div>
                          {item.subItems && (
                            <div className="pl-7 space-y-2">
                              {item.subItems.map((subItem, subIdx) => (
                                <Link
                                  key={subIdx}
                                  to={subItem.path}
                                  className="block text-gray-400 hover:text-blue-300 transition-colors"
                                  onClick={() => setOpen(false)}
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </nav>
                    <div className="mt-8 space-y-4">
                      {auth && auth.length !== 0 ? (
                        <div className="bg-blue-900/30 rounded-lg p-4">
                          <div className="text-white font-medium mb-1">{auth.fullName}</div>
                          <div className="text-blue-300 text-sm mb-4 truncate">{auth.email}</div>
                          <Button 
                            variant="outline"
                            className="w-full border-red-400 text-red-300 hover:bg-red-900/30 flex items-center justify-center gap-2"
                            onClick={() => {
                              setOpen(false);
                              handleLogout();
                            }}
                          >
                            <LogOut className="w-4 h-4" />
                            Log out
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => {
                              setOpen(false);
                              navigate('/login');
                            }}
                          >
                            Sign In
                          </Button>
                          <Button 
                            variant="outline"
                            className="w-full border-blue-400 text-blue-300 hover:bg-blue-900/50"
                            onClick={() => {
                              setOpen(false);
                              navigate('/register');
                            }}
                          >
                            Register
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;