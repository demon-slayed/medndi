import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  CalendarDays,
  DoorOpen,
  Clock9,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import avatar1 from "../../../components/avatar/avatar-1.png";
import avatar2 from "../../../components/avatar/avatar-2.png";
import avatar3 from "../../../components/avatar/avatar-3.png";
import avatar4 from "../../../components/avatar/avatar-4.png";
import avatar5 from "../../../components/avatar/avatar-5.png";
import avatar6 from "../../../components/avatar/avatar-6.png";
import { useEffect, useState } from "react";

// Dummy data
const statsData = [
  {
    title: "Clients",
    value: "1,548",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Consultation",
    value: "448",
    icon: CalendarDays,
    color: "bg-pink-500",
  },
  { title: "Staff", value: "848", icon: Users, color: "bg-orange-500" },
  {
    title: "Hotel",
    value: "812",
    icon: DoorOpen,
    color: "bg-cyan-500",
  },
];

const revenueData = [
  { date: "01 Jan", income: 2400, expense: 1398 },
  { date: "02 Jan", income: 3000, expense: 1800 },
  { date: "03 Jan", income: 2000, expense: 1200 },
  { date: "04 Jan", income: 2780, expense: 1908 },
  { date: "05 Jan", income: 1890, expense: 1800 },
  { date: "06 Jan", income: 2390, expense: 1400 },
  { date: "07 Jan", income: 3490, expense: 2300 },
];

const paymentsData = [
  {
    name: "Dr. Johan Doe",
    service: "Kidney function test",
    amount: 25.15,
    time: "Sunday, 16 May",
  },
  {
    name: "Dr. Michael Doe",
    service: "Emergency appointment",
    amount: 99.15,
    time: "Sunday, 16 May",
  },
  {
    name: "Dr. Barrie Maxwell",
    service: "Complementation test",
    amount: 40.45,
    time: "Sunday, 16 May",
  },
];

const appointmentsData = [
  {
    name: "Shawn Hampton",
    type: "Emergency appointment",
    time: "10:00",
    amount: 30,
    avatar: avatar1,
  },
  {
    name: "Polly Paul",
    type: "USG + Consultation",
    time: "10:30",
    amount: 50,
    avatar: "https://ui-avatars.com/api/?name=Polly+Paul&background=random",
  },
  {
    name: "Johan Doe",
    type: "Laboratory screening",
    time: "11:00",
    amount: 70,
    avatar: "https://ui-avatars.com/api/?name=Johan+Doe&background=random",
  },
  {
    name: "Harmani Doe",
    type: "Keeping pregnant",
    time: "11:30",
    amount: 60,
    avatar: "https://ui-avatars.com/api/?name=Harmani+Doe&background=random",
  },
  {
    name: "Sophia Turner",
    type: "Cardiology Checkup",
    time: "12:00",
    amount: 80,
    avatar: "https://ui-avatars.com/api/?name=Sophia+Turner&background=random",
  },
  {
    name: "Liam Smith",
    type: "Physiotherapy Session",
    time: "12:30",
    amount: 55,
    avatar: "https://ui-avatars.com/api/?name=Liam+Smith&background=random",
  },
  {
    name: "Emma Johnson",
    type: "Dental Consultation",
    time: "13:00",
    amount: 45,
    avatar: "https://ui-avatars.com/api/?name=Emma+Johnson&background=random",
  },
  {
    name: "Noah Williams",
    type: "ENT Consultation",
    time: "13:30",
    amount: 65,
    avatar: "https://ui-avatars.com/api/?name=Noah+Williams&background=random",
  },
  {
    name: "Olivia Brown",
    type: "Dermatology Checkup",
    time: "14:00",
    amount: 75,
    avatar: "https://ui-avatars.com/api/?name=Olivia+Brown&background=random",
  },
  {
    name: "William Taylor",
    type: "General Consultation",
    time: "14:30",
    amount: 40,
    avatar: "https://ui-avatars.com/api/?name=William+Taylor&background=random",
  },
  {
    name: "Ava Martinez",
    type: "Neurology Consultation",
    time: "15:00",
    amount: 90,
    avatar: "https://ui-avatars.com/api/?name=Ava+Martinez&background=random",
  },
  {
    name: "James Anderson",
    type: "Ophthalmology Checkup",
    time: "15:30",
    amount: 50,
    avatar: "https://ui-avatars.com/api/?name=James+Anderson&background=random",
  },
  {
    name: "Isabella Thomas",
    type: "Vaccination",
    time: "16:00",
    amount: 35,
    avatar:
      "https://ui-avatars.com/api/?name=Isabella+Thomas&background=random",
  },
  {
    name: "Lucas White",
    type: "Orthopedic Consultation",
    time: "16:30",
    amount: 85,
    avatar: "https://ui-avatars.com/api/?name=Lucas+White&background=random",
  },
];

const doctorsData = [
  {
    name: "Dr. Jaylon Stanton",
    specialty: "Dentist",
    avatar: avatar1,
  },
  {
    name: "Dr. Carla Schleifer",
    specialty: "Oculist",
    avatar: avatar2,
  },
  {
    name: "Dr. Hanna Geldt",
    specialty: "Surgeon",
    avatar: avatar3,
  },
  {
    name: "Dr. Olivia Browne",
    specialty: "Cardiologist",
    avatar: avatar4,
  },
  {
    name: "Dr. Lucas White",
    specialty: "Neurologist",
    avatar: avatar5,
  },
  {
    name: "Dr. Sophia Turner",
    specialty: "Pediatrician",
    avatar: avatar6,
  },
  {
    name: "Dr. Liam Smith",
    specialty: "Orthopedist",
    avatar: avatar1,
  },
  {
    name: "Dr. Ethan James",
    specialty: "Gastroenterologist",
    avatar: avatar2,
  },
  {
    name: "Dr. Emily Clark",
    specialty: "Dermatologist",
    avatar: avatar3,
  },
  {
    name: "Dr. William Taylor",
    specialty: "Psychiatrist",
    avatar: avatar4,
  },
  {
    name: "Dr. Ava Martinez",
    specialty: "Endocrinologist",
    avatar: avatar5,
  },
  {
    name: "Dr. Noah Williams",
    specialty: "ENT Specialist",
    avatar: avatar6,
  },
  {
    name: "Dr. Isabella Thomas",
    specialty: "Radiologist",
    avatar: avatar1,
  },
];

const ratingsData = [
  { rating: 5, percentage: 65, color: "bg-purple-500" }, // 40% for rating 5
  { rating: 4, percentage: 17, color: "bg-blue-500" }, // 30% for rating 4
  { rating: 3, percentage: 9, color: "bg-green-500" }, // 20% for rating 3
  { rating: 2, percentage: 7, color: "bg-yellow-500" }, // 7% for rating 2
  { rating: 1, percentage: 2, color: "bg-red-500" }, // 3% for rating 1
];

export default function DashboardPage() {
  const [barSize, setBarSize] = useState(20);
  const [fontSize, setFontSize] = useState(12);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) {
        setBarSize(12); // Smaller bars on small screens
        setFontSize(10); // Smaller font on small screens
      } else if(window.innerWidth < 1024 && window.innerWidth > 768) {
        setBarSize(16);
        setFontSize(12);
      } else {
        setBarSize(22);
        setFontSize(12);
      }
    };

    updateSize(); // Set initial values
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="flex max-md:flex-col max-md:justify-center items-center p-6">
                <div className={`rounded-full p-2 ${stat.color} max-md:ml-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 max-md:flex-col max-md:flex max-md:items-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold max-sm:font-semibold">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          {/* daily revenue report bar chart */}
          <Card>
      <CardHeader>
        <CardTitle>Daily Revenue Report</CardTitle>
      </CardHeader>
      <CardContent className=' p-0'>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <XAxis dataKey="date" tick={{ fontSize }} />
            <YAxis tick={{ fontSize }} />
            <Tooltip />
            <Bar dataKey="income" fill="rgb(0, 208, 255)" barSize={barSize} radius={[10, 10, 0, 0]} />
            <Bar dataKey="expense" fill="rgb(50, 70, 211)" barSize={barSize} radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Legend Section */}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-[rgb(0,208,255)] rounded" />
            <span className="text-sm text-gray-600">Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-[rgb(50,70,211)] rounded" />
            <span className="text-sm text-gray-600">Expense</span>
          </div>
        </div>
      </CardContent>
    </Card>
        </motion.div>

        {/* upcoming appointments */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="border-b border-gray-300 pb-2">
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[304px] pr-2">
                {appointmentsData.map((appointment, index) => (
                  <div key={index}>
                    <div
                      className="mb-4 flex items-start justify-between"
                    >
                      <div className="flex items-center">
                        <img
                          className="h-9 w-9 rounded-md bg-[#E9F9F9]"
                          src={appointment.avatar}
                        />
                        <div className="ml-4">
                          <p className="text-sm font-medium">
                            {appointment.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.type}
                          </p>
                        </div>
                        <div></div>
                      </div>
                    </div>
                    <div className="mt-1 text-sm flex gap-5 items-center">
                      <p className="font-medium flex items-center justify-center">
                        <Clock9 className="mr-2 h-3 w-3" />
                        {appointment.time}
                      </p>{" "}
                      <p className="text-muted-foreground">
                        ${appointment.amount}
                      </p>
                    </div>
                    <hr className=" mb-3 mt-3" />
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* doctor list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="border-b border-gray-300 pb-2">
                Doctor List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[155px] pr-2">
                {doctorsData.map((doctor, index) => (
                  <div
                    key={index}
                    className="mb-4 flex items-center justify-between last:mb-0"
                  >
                    <div className="flex items-center">
                      <img
                        className="h-9 w-9 rounded-md bg-[#E9F9F9]"
                        src={doctor.avatar}
                      />
                      <div className="ml-4">
                        <p className="text-sm font-medium">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doctor.specialty}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className=" h-[253px]">
            <CardHeader>
              <CardTitle className="border-b border-gray-300 pb-2">
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-[#e8f9f9] p-2">
                    <ArrowUp className="h-8 w-8 text-[#1dbfc1]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">Income</p>
                    <p className="text-2xl font-bold">$142K</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="rounded-full bg-[#ffd6de] p-2">
                    <ArrowDown className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">Outcome</p>
                    <p className="text-2xl font-bold">$43K</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* checking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="border-b border-gray-300 pb-2">
                Ratings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {" "}
              {/* Remove default padding */}
              <ScrollArea className="h-[180px]">
                {" "}
                {/* Set a specific height */}
                <div className="pl-5 pr-5">
                  {" "}
                  {/* Add padding inside ScrollArea */}
                  {ratingsData.map((item) => (
                    <div key={item.rating} className="last:mb-0">
                      {/* Progress Bar */}
                      <div className="mt-2">
                        <div className="flex flex-col pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <span className="text-xs font-semibold inline-block py-1 uppercase">
                              {item.rating} Star
                            </span>
                            <span className="text-xs font-semibold inline-block py-1">
                              {item.percentage}%
                            </span>
                          </div>
                          <div className="flex mb-2">
                            <div className="w-full bg-gray-200 rounded-full">
                              <div
                                className={`h-2 rounded-full ${item.color}`}
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
