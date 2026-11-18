// src/pages/DashboardPage.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./components/Dashboard";
import Header from "@/components/Layout/Header";
import Application from "./components/Application";
import Create from "./components/Create";


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
      default:
        return <Create />;
    }
  };

  return (
    <>
    <Header />
    <div className="flex mt-24">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6 ml-64 max-lg:ml-0">{renderPage()}</div>
    </div>
    </>
  );
};

export default DashboardPage;
