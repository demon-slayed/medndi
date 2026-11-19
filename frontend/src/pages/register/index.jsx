import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  Eye,
  EyeOff,
  CheckCircle,
  MapPin,
  Users,
  Calendar,
  Shield,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MedNdiLogo from "@/assets/icons/MedNdiLogo";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import toast from "react-hot-toast";

const benefits = [
  { icon: CheckCircle, text: "Accredited partner hospitals" },
  { icon: MapPin, text: "Delhi NCR, Bengaluru & Pune" },
  { icon: Users, text: "A dedicated care coordinator" },
  { icon: Calendar, text: "Book treatment dates online" },
  { icon: Shield, text: "Your reports kept private" },
  { icon: Heart, text: "Post-treatment follow-up" },
];

const accreditations = ["JCI accredited", "NABH accredited", "Prices in ₹", "24/7 support"];

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedHeight, setSelectedHeight] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [age, setAge] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const genderOptions = ["Male", "Female", "Others"];
  const heightOptions = [150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200];
  const weightOptions = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  // Returns the first validation problem, or null when the form is complete
  const validate = () => {
    if (!fullName.trim()) return "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Please enter a valid email.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (!selectedHeight) return "Please select your height.";
    if (!selectedWeight) return "Please select your weight.";
    const ageNum = Number(age);
    if (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 120) return "Please enter a valid age.";
    if (!selectedGender) return "Please select your gender.";
    return null;
  };

  const handleRegisterClick = async (e) => {
    e?.preventDefault();
    const problem = validate();
    if (problem) {
      toast.error(problem);
      return;
    }
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        {
          email: email.trim(),
          password: password,
          gender: selectedGender,
          height: selectedHeight,
          weight: selectedWeight,
          age: Number(age),
          fullName: fullName.trim(),
        }
      );

      if (response.status === 201) {
        toast.success("Registration successful! Please log in.");
        navigate("/login");
      }
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Futuristic Gradient with Glassmorphism */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#1A1F71] via-[#3252DF] to-[#5E81FF] text-white p-12 flex-col justify-between relative overflow-hidden"
      >
        {/* Glassmorphic Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/assets/pattern.svg')] opacity-5" />
        </div>

        {/* Logo & Title */}
        <div className="relative z-10">
          <MedNdiLogo onClick={() => navigate("/")} className=' cursor-pointer'/>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 space-y-6"
          >
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Quality treatment
              </span>
              <br />
              in India, planned for you
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-md">
              Compare accredited hospitals, see costs upfront and get one
              coordinator for your whole trip.
            </p>
          </motion.div>
        </div>

        {/* Benefits Section with Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 grid grid-cols-2 gap-6"
        >
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="p-3 rounded-lg bg-white/10 backdrop-blur-md">
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-white/90">{benefit.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 bg-white/10 rounded-2xl p-6 backdrop-blur-sm"
        >
          <div className="text-white/90 text-sm mb-4">
            Every hospital on MedNDI is JCI and/or NABH accredited
          </div>
          <div className="flex flex-wrap gap-2">
            {accreditations.map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-sm font-medium text-white"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Right Section - Login Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full lg:w-1/2 bg-white px-6 py-10 sm:p-12 flex flex-col justify-center"
      >
        <div className="max-w-md mx-auto w-full">
          {/* Language & Register Buttons */}
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="MedNDI home"
            className="lg:hidden mb-8 inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40"
          >
            <MedNdiLogo textColor="#152C5B" tagColor="#3252DF" accentColor="#fff" />
          </button>
          <div className="flex justify-between items-center gap-4 mb-10 sm:mb-12">
            <span className="text-sm text-gray-500">Already have an account?</span>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/login")}
              className="shrink-0 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white px-6 py-2 rounded-xl font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
            >
              Login
            </motion.button>
          </div>

          {/* Register Form */}
          <form className="space-y-6" onSubmit={handleRegisterClick} noValidate>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Create your account</h2>
            <Input
              type="email"
              placeholder="Email"
              aria-label="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border-gray-100 rounded-xl py-6"
            />
            <Input
              type="text"
              placeholder="Full name"
              aria-label="Full name"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-gray-50 border-gray-100 rounded-xl py-6"
            />
            <div className="relative">
              <Input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password (min 6 characters)"
                aria-label="Password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border-gray-100 rounded-xl py-6 pr-12"
              />
              <button
                type="button"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                onClick={() => setPasswordVisible((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* height and weight */}
            <div className="flex flex-row w-full gap-2">
              {/* Height */}
              <div className="flex-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-12 flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl text-gray-600 font-normal shadow-none hover:bg-gray-100"
                    >
                      {selectedHeight ? `${selectedHeight} cm` : "Height"}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-64 overflow-y-auto">
                    {heightOptions.map((height) => (
                      <DropdownMenuItem
                        key={height}
                        onClick={() => setSelectedHeight(height)}
                      >
                        {height} cm
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Weight */}
              <div className="flex-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-12 flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl text-gray-600 font-normal shadow-none hover:bg-gray-100"
                    >
                      {selectedWeight ? `${selectedWeight} kg` : "Weight"}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-64 overflow-y-auto">
                    {weightOptions.map((weight) => (
                      <DropdownMenuItem
                        key={weight}
                        onClick={() => setSelectedWeight(weight)}
                      >
                        {weight} kg
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex flex-row gap-2 w-full">
              {/* Age */}
              <div className="w-[35%]">
                <Input
                  type="number"
                  min={1}
                  max={120}
                  placeholder="Age"
                  aria-label="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full h-12 bg-gray-50 border-gray-100 rounded-xl text-gray-600"
                />
              </div>

              {/* Gender */}
              <div className="w-[65%]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-12 flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl text-gray-600 font-normal shadow-none hover:bg-gray-100"
                    >
                      {selectedGender || "Gender"}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-64 overflow-y-auto">
                    {genderOptions.map((gender) => (
                      <DropdownMenuItem
                        key={gender}
                        onClick={() => setSelectedGender(gender)}
                      >
                        {gender}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              className="w-full py-4 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2 disabled:opacity-70"
            >
              {submitting ? "Creating account..." : "Register"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
