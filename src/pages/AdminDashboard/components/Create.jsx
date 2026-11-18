import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import TreatmentCreate from "./TreatmentCreate";
import HospitalForm from "./HospitalForm";
import HotelForm from "./HotelForm";
import HotelsCards from "./HotelsCards";
import TreatmentCards from "./TreatmentCards";
import HospitalCards from "./HospitalCards";

const Create = () => {
  const [selectedHotel, setSelectedHotel] = useState([]);
  const [selectedTreatment, setSelectedTreatment] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState([]);

  return (
    <div className="container mx-auto p-6 max-sm:p-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500 mb-12">
          Dashboard Management
        </h1>

        <Tabs defaultValue="treatment" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="treatment">Treatment Management</TabsTrigger>
            <TabsTrigger value="hospital">Hospital Management</TabsTrigger>
            <TabsTrigger value="hotel">Hotel Management</TabsTrigger>
          </TabsList>

          {/* Treatment Tab */}
          <TabsContent value="treatment">
            <Card className="w-full max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition hover:shadow-xl">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-2xl font-bold text-blue-900">
                  Add / Update New Treatment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* treatment form  */}
                <TreatmentCreate
                  selectedTreatment={selectedTreatment}
                  setSelectedTreatment={setSelectedTreatment}
                />
              </CardContent>
            </Card>
            {/* treatment add or update */}
            <TreatmentCards onTreatmentSelect={setSelectedTreatment} />
          </TabsContent>

          {/* Hospital Tab */}
          <TabsContent value="hospital">
            <Card className="w-full max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition hover:shadow-xl">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-2xl font-bold text-blue-900">
                  Add New Hospital
                </CardTitle>
              </CardHeader>
              <CardContent>
                 {/* hospital form */}
                <HospitalForm selectedHospital={selectedHospital}/>
              </CardContent>
            </Card>
            {/* hospital cards */}
            <HospitalCards onHospitalSelect = {setSelectedHospital}/>
          </TabsContent>

          {/* Hotel Tab */}
          <TabsContent value="hotel">
            <Card className="w-full max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition hover:shadow-xl">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-2xl font-bold text-blue-900">
                  Add or Update Hotel
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/**Hotel Form */}
                <HotelForm
                  selectedHotel={selectedHotel}
                  setSelectedHotel={setSelectedHotel}
                />
              </CardContent>
            </Card>
            {/* Hotel cards for update */}
            <HotelsCards onHotelSelect={setSelectedHotel} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Create;
