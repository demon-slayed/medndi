// src/pages/DashboardPage.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./components/Dashboard";
import Header from "@/components/Layout/Header";
import Application from "./components/Application";
import Create from "./components/Create";
import Users from "./components/Users";


const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("application"); // Default tab

  // Function to render the correct component based on activeTab
  const renderPage = () => {
    switch (activeTab) {
      // case "dashboard":
      //   return <Dashboard />;
      case "application":
        return <Application />;
      case "create":
         return <Create />
      case "users":
        return <Users />;
      default:
        return <Create />;
    }
  };

  return (
    <>
    <Header />
    <div className="flex pt-28">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 min-w-0 p-4 sm:p-6 pb-24 lg:pb-6 ml-64 max-lg:ml-0">{renderPage()}</div>
    </div>
    </>
  );
};

export default DashboardPage;
