import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Grip,
  SquarePen,
  Menu,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import image1 from "../../components/avatar/2.jpg";
import { useState } from "react";
import useAppStore from "@/store/useAppStore";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { auth } = useAppStore();
  const menuItems = [
    // { icon: LayoutDashboard, label: "Dashboard" },
    { icon: Grip, label: "Application" },
    { icon: SquarePen, label: "Create" },
  ];

  // If activeTab is undefined or empty, default to the first tab (Dashboard)
  const [isOpen, setIsOpen] = useState(false);
  const defaultTab = "create";
  const selectedTab = activeTab || defaultTab;

  return (
    <>
      {/* Sidebar for Large Screens */}
      <div className="w-64 bg-white h-[calc(100vh-88px)] p-6 flex flex-col border-r fixed top-0 left-0 lg:flex max-lg:hidden mt-24">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-3xl ml-4  font-bold">
            Arog<span className="text-blue-600">ini</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <motion.li key={item.label} whileHover={{ x: 5 }}>
                <button
                  onClick={() => setActiveTab(item.label.toLowerCase())}
                  className={`flex items-center w-full p-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                    selectedTab === item.label.toLowerCase()
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Profile */}
        <div className="pt-4 border-t">
          <div className="flex items-center space-x-3">
            <Avatar>
              {auth?.image ? (
                <AvatarImage src={auth.image} />
              ) : (
                <AvatarFallback className="bg-[#E9F9F9] text-black font-semibold">
                  {auth?.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <div>
              <p className="font-medium">{auth?.fullName}</p>
              <p className="text-sm text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navbar for Small Screens */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t shadow-md flex justify-around p-2 z-10">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveTab(item.label.toLowerCase())}
            className={`flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors ${
              selectedTab === item.label.toLowerCase() ? "text-blue-600" : ""
            }`}
          >
            <item.icon className="h-6 w-6" />
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
