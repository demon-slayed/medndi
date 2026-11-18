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
  { icon: CheckCircle, text: "Access to 500+ Hospitals" },
  { icon: MapPin, text: "Coverage across 50+ cities" },
  { icon: Users, text: "2000+ Expert Doctors" },
  { icon: Calendar, text: "Easy Appointment Booking" },
  { icon: Shield, text: "Secure Medical Records" },
  { icon: Heart, text: "Personalized Health Plans" },
];

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
            <h1 className="text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Premium Healthcare
              </span>
              <br />
              Without Borders
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-md">
              Experience world-class medical care with personalized assistance
              at every step.
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
            Trusted by Healthcare Providers
          </div>
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="w-16 h-8 bg-white/20 rounded-lg" />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Right Section - Login Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full lg:w-1/2 bg-white p-12 flex flex-col justify-center"
      >
        <div className="max-w-md mx-auto w-full">
          {/* Language & Register Buttons */}
          <div className="flex justify-between items-center mb-12">
            <span className="text-sm text-gray-500">Already have an account?</span>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white px-6 py-2 rounded-xl font-medium"
            >
              Login
            </motion.button>
          </div>

          {/* Register Form */}
          <form className="space-y-6" onSubmit={handleRegisterClick} noValidate>
            <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
            <Input
              type="email"
              placeholder="Enter Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border-gray-100 rounded-xl py-6"
            />
            <Input
              type="text"
              placeholder="Enter Full Name"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-gray-50 border-gray-100 rounded-xl py-6"
            />
            <div className="relative">
              <Input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password (min 6 characters)"
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
                      className="w-full flex items-center justify-between bg-[#EAF0F7] py-5 text-[#4F555A] border-none   focus-visible:ring-0"
                    >
                      {selectedHeight ? `${selectedHeight} cm` : "Height"}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
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
                      className="w-full flex items-center justify-between bg-[#EAF0F7] py-5 text-[#4F555A]"
                    >
                      {selectedWeight ? `${selectedWeight} kg` : "Weight"}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
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
              <div className="w-[30%]">
                <Input
                  type="number"
                  min={1}
                  max={120}
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-[#EAF0F7] py-5 border-none   focus-visible:ring-0 text-[#4F555A]"
                />
              </div>

              {/* Gender */}
              <div className="w-[70%]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-between bg-[#EAF0F7] py-5 text-[#4F555A] border-none   focus-visible:ring-0"
                    >
                      {selectedGender || "Gender"}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
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
              className="w-full py-4 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-xl font-medium disabled:opacity-70"
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
