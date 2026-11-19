import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import Layout from '@/components/Layout/Layout';

const EMPTY_FORM = { firstName: "", lastName: "", email: "", phone: "", message: "" };

const validate = (form) => {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = "Please enter your first name.";
  if (!form.email.trim()) errors.email = "Please enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Please enter a valid email.";
  if (form.phone.trim() && !/^[+\d][\d\s()-]{6,}$/.test(form.phone.trim())) errors.phone = "Please enter a valid phone number.";
  if (form.message.trim().length < 10) errors.message = "Please tell us a little more (at least 10 characters).";
  return errors;
};

const ContactPage = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    // No contact endpoint yet: acknowledge and reset.
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Thanks! Our care team will get back to you within 24 hours.");
      setForm(EMPTY_FORM);
      setSubmitting(false);
    }, 400);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        <PageHeader
          eyebrow="Contact"
          title="Get in touch"
          subtitle="Questions about a treatment, a hospital or your booking? Our care team replies within one working day."
        />
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-6">Send us a message</h2>
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-2">First Name *</label>
                      <Input id="firstName" name="firstName" placeholder="Amina" value={form.firstName} onChange={handleChange} />
                      {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-2">Last Name</label>
                      <Input id="lastName" name="lastName" placeholder="Okafor" value={form.lastName} onChange={handleChange} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
                    <Input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
                    {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Message *</label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your medical needs..."
                      className="min-h-[150px]"
                      value={form.message}
                      onChange={handleChange}
                    />
                    {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
                  </div>
                  <Button type="submit" variant="brand" size="xl" disabled={submitting} className="w-full">
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src="https://images.unsplash.com/photo-1579684453423-f84349ef60b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/assets/hospital1.png"; }}
                    alt="Our office"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">Our offices</h2>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <h3 className="font-semibold">Address</h3>
                          <p className="text-gray-600">Head office: New Delhi, India<br />Patient help desks in Delhi NCR, Bengaluru and Pune (by appointment)</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <h3 className="font-semibold">Working Hours</h3>
                          <p className="text-gray-600">Monday - Saturday: 9:00 AM - 8:00 PM<br />Sunday: 10:00 AM - 4:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-gray-600"><a href="tel:+9118001234567" className="hover:text-[#3252DF]">+91 1800 123 4567</a></p>
                      <p className="text-sm text-gray-500">Toll-free, 24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-600"><a href="mailto:info@medndi.com" className="hover:text-[#3252DF]">info@medndi.com</a></p>
                      <p className="text-sm text-gray-500">We reply within one working day</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Emergency Contact */}
            <motion.div variants={itemVariants}>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-800">24/7 Emergency Support</h3>
                      <p className="text-blue-700">Our emergency support team is available round the clock to assist you with any urgent medical needs.</p>
                      <Button asChild variant="link" className="text-blue-600 p-0 mt-2">
                        <a href="tel:+9118001234567">Contact Emergency Team →</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default ContactPage;