import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
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
import axios from "axios";
import toast from "react-hot-toast";
import useAppStore from "@/store/useAppStore";

const benefits = [
  { icon: CheckCircle, text: "Accredited partner hospitals" },
  { icon: MapPin, text: "Delhi NCR, Bengaluru & Pune" },
  { icon: Users, text: "A dedicated care coordinator" },
  { icon: Calendar, text: "Book treatment dates online" },
  { icon: Shield, text: "Your reports kept private" },
  { icon: Heart, text: "Post-treatment follow-up" },
];

const accreditations = ["JCI accredited", "NABH accredited", "Prices in ₹", "24/7 support"];

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { setAuth, redirectPath, setRedirectPath } = useAppStore();

  const handleLoginClick = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        { email, password },
        {
          withCredentials: true,
        }
      );

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/profile`,
        {
          withCredentials: true,
        }
      );

      toast.success("Logged in successfully");

      const user = response.data?.user;
      setAuth(user);

      // Admins go to their dashboard; patients return to where they started
      const returnTo = user?.role === "Admin" ? "/admin-dashboard" : redirectPath || "/";
      setRedirectPath("");
      navigate(returnTo, { replace: true });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to reach the server. Please try again."
      );
      setAuth(null);
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
          <MedNdiLogo
            onClick={() => navigate("/")}
            className=" cursor-pointer"
          />
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
            Every hospital on MedNdi is JCI and/or NABH accredited
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
          {/* Register Button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="MedNdi home"
            className="lg:hidden mb-8 inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40"
          >
            <MedNdiLogo textColor="#152C5B" tagColor="#3252DF" accentColor="#fff" />
          </button>
          <div className="flex justify-between items-center gap-4 mb-10 sm:mb-12">
            <span className="text-gray-500">New to MedNdi?</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/register")}
              className="shrink-0 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white px-6 py-2 rounded-xl font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
            >
              Register
            </motion.button>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleLoginClick}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome Back</h2>
            <Input
              type="email"
              placeholder="Email"
              aria-label="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border-gray-100 rounded-xl py-6"
            />
            <div className="relative">
              <Input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                aria-label="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border-gray-100 rounded-xl py-6 pr-12"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
              >
                {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
