import { motion } from "framer-motion";
import {
  Bell,
  Calendar,
  FileText,
  Globe,
  Heart,
  MapPin,
  Phone,
  Stethoscope,
  User,
  CheckCircle2,
  Clock,
  Circle,
  Utensils,
  Smile,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import BookedApplications from "./components/BookedApplications";
import { useState, useEffect } from "react";
import axios from "axios";
import useAppStore from "@/store/useAppStore";
import { Outlet } from "react-router-dom";
import ApplicationStatusStepper from "./components/ApplicationStatusStepper";
import PostCareRequestForm from "./components/PostCareRequestForm";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const hoverScale = {
  whileHover: { scale: 1.05 },
  transition: { type: "spring", stiffness: 300 },
};

const postCareServices = [
  {
    title: "Virtual Consultations",
    description: "Connect with your doctors remotely for follow-up care.",
    icon: <Stethoscope className="w-6 h-6 text-blue-500" />,
  },
  {
    title: "Medication Reminders",
    description: "Stay on track with your prescribed medication schedule.",
    icon: <Bell className="w-6 h-6 text-blue-500" />,
  },
  {
    title: "Recovery Tracking",
    description: "Monitor your progress and share updates with your care team.",
    icon: <Heart className="w-6 h-6 text-blue-500" />,
  },
  {
    title: "Home Nursing Support",
    description:
      "Access professional nursing care at home for a smooth recovery.",
    icon: <User className="w-6 h-6 text-blue-500" />,
  },
  {
    title: "Diet & Nutrition Guidance",
    description:
      "Receive personalized diet plans for better healing and strength.",
    icon: <Utensils className="w-6 h-6 text-blue-500" />,
  },
  {
    title: "Mental Health Support",
    description:
      "Get psychological counseling to ensure emotional well-being post-surgery.",
    icon: <Smile className="w-6 h-6 text-blue-500" />,
  },
];

const destinations = [
  {
    name: "Bangkok, Thailand",
    image:
      "https://media.istockphoto.com/id/2047816268/photo/healthcare-workers-going-to-work.webp?a=1&b=1&s=612x612&w=0&k=20&c=c2DCC5qn5seZjHfwKBgOPDI4kAMsk5Wwd0qd3EsSwyY=",
  },
  {
    name: "Istanbul, Turkey",
    image:
      "https://plus.unsplash.com/premium_photo-1661745745478-bb3542627ebc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aXN0YW5idWwlMjBtZWRpY2FsfGVufDB8fDB8fHww",
  },
  {
    name: "Mumbai, India",
    image:
      "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bXVtYmFpJTIwbWVkaWNhbHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    name: "Seoul, South Korea",
    image:
      "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c291dGglMjBrb3JlYSUyMG1lZGljYWx8ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "Dubai, UAE",
    image:
      "https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNvdXRoJTIwa29yZWElMjBtZWRpY2FsfGVufDB8fDB8fHww",
  },
  {
    name: "Kuala Lumpur, Malaysia",
    image:
      "https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNvdXRoJTIwa29yZWElMjBtZWRpY2FsfGVufDB8fDB8fHww",
  },
];

export default function PatientDashboard() {
  const [application, setApplication] = useState();
  const [currentStatus, setCurrentStatus] = useState("");
  const { auth } = useAppStore();

  useEffect(() => {
    const fetchApplicationsByUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/application/getByUserId/${
            auth?._id
          }`,
          {
            withCredentials: true,
          }
        );

        const data = res?.data;
        console.log("application fetched is: ", data);

        setApplication(data);
        setCurrentStatus(data[0]?.status);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        return [];
      }
    };

    fetchApplicationsByUser();
  }, []);

  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white mt-24">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl font-bold mb-2 text-blue-800">
              Arogini Medical Tourism
            </h1>
            <p className="text-xl text-gray-600">
              Your Journey to Health and Wellness
            </p>
          </motion.div>

          <Tabs defaultValue="application" className="w-full">
            <TabsList className="mb-8 justify-center">
              <TabsTrigger value="postcare">Post-Care Support</TabsTrigger>
              <TabsTrigger value="application">Application Status</TabsTrigger>
              <TabsTrigger value="destinations">
                Popular Destinations
              </TabsTrigger>
            </TabsList>

            {/* Tab 1 content */}
            <TabsContent value="postcare">
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {postCareServices.map((service, index) => (
                  <motion.div key={index} {...fadeIn} {...hoverScale}>
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {service.icon}
                          {service.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{service.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          className="text-[#3252DF] hover:text-[#3252DF]"
                          onClick={() => {
                            navigate("/contact");
                          }}
                        >
                          Learn More
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div {...fadeIn} className="mt-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-blue-500" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-blue-100 transition-colors"
                      >
                        Book Nurse Visit
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-blue-100 transition-colors"
                      >
                        Schedule Consultation
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-blue-100 transition-colors"
                      >
                        View Recovery Plan
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-blue-100 transition-colors"
                      >
                        Request Medication Refill
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div> */}
              <PostCareRequestForm />
            </TabsContent>

            {/* tab 2 content */}
            <TabsContent value="application">
              {application && application.length > 0 ? (
                <>
                  {/* booked application confirmation page */}
                  <BookedApplications />
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {/* Card 1 */}
                    <motion.div {...fadeIn} className="w-full">
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle>Important Guidelines</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-4">
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                              <span>
                                Document verification takes 24-48 hours
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                              <span>
                                Stay available for follow-up communications
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                              <span>
                                Arrange travel within 3-5 days of approval
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                              <span>Prepare all necessary medical records</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div {...fadeIn} className="w-full">
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle>Payment & Billing Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-4">
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                              <span>
                                Ensure advance payment confirmation to avoid
                                delays
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                              <span>
                                All medical bills should be settled before
                                discharge
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                              <span>
                                Additional costs may apply for extended stays
                              </span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div {...fadeIn} className="w-full">
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle>Travel & Accommodation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-4">
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 mt-2 rounded-full bg-orange-500" />
                              <span>
                                Book accommodation near the hospital for
                                convenience
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 mt-2 rounded-full bg-orange-500" />
                              <span>
                                Confirm airport pickup service if needed
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 mt-2 rounded-full bg-orange-500" />
                              <span>
                                Ensure travel documents are valid throughout
                                your stay
                              </span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                >
                  <img
                    src="/empty-booking.svg"
                    alt="No Bookings"
                    className="w-32 h-32 opacity-70"
                  />
                  <h2 className="text-xl font-semibold text-gray-700">
                    Your bookings will show here
                  </h2>
                  <p className="text-gray-500 max-w-md">
                    Once you complete your treatment application, your progress
                    and details will appear in this section.
                  </p>
                </motion.div>
              )}
            </TabsContent>

            {/* Tab 3 content */}
            <TabsContent value="destinations">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {destinations.map((destination, index) => (
                  <motion.div key={index} {...fadeIn} {...hoverScale}>
                    <Card className="overflow-hidden">
                      <img
                        src={destination.image || "/placeholder.svg"}
                        alt={destination.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <CardHeader>
                        <CardTitle>{destination.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          Discover world-class medical facilities and beautiful
                          attractions.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          className=" text-[#3252DF] hover:text-[#3252DF]"
                          onClick={() => {
                            navigate("/treatments");
                          }}
                        >
                          Explore Treatments
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <motion.div {...fadeIn} className="mt-16">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Why Choose Arogini Medical Tourism?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="flex flex-col items-center text-center">
                    <Globe className="w-12 h-12 text-blue-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Global Network
                    </h3>
                    <p className="text-gray-600">
                      Access to top-tier hospitals and specialists worldwide
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Heart className="w-12 h-12 text-blue-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Personalized Care
                    </h3>
                    <p className="text-gray-600">
                      Tailored treatment plans and dedicated support throughout
                      your journey
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <MapPin className="w-12 h-12 text-blue-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Travel Assistance
                    </h3>
                    <p className="text-gray-600">
                      Comprehensive travel planning and local guidance
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Phone className="w-12 h-12 text-blue-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
                    <p className="text-gray-600">
                      Round-the-clock assistance for peace of mind
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...fadeIn} className="mt-16 text-center">
            <h2 className="text-3xl font-bold mb-4 text-blue-800">
              Ready to Start Your Health Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our team of experts is here to guide you every step of the way.
            </p>
            <Button
              size="lg"
              className="text-lg px-8 bg-[#4466ff] hover:bg-[#4466ff]"
              onClick={() => {
                navigate("/treatments");
              }}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule a Consultation
            </Button>
          </motion.div>
          <button
            className="fixed bottom-6 right-6 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full py-3 px-5 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 z-50"
            onClick={() => navigate("query")}
          >
            <FileText size={18} />
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">Upload PDF</span>
              <span className="text-xs">for disease details</span>
            </div>
          </button>
        </div>
      </div>
      {/* <Outlet /> */}
    </Layout>
  );
}
