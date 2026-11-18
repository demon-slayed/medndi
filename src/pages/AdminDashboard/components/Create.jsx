import React, { useState } from "react";
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
  const [selectedHotel, setSelectedHotel] = useState({});
  const [selectedTreatment, setSelectedTreatment] = useState({});
  const [selectedHospital, setSelectedHospital] = useState({});
  // bumped after any create/update/delete so the card lists refetch
  const [refreshKey, setRefreshKey] = useState(0);
  const handleSaved = () => setRefreshKey((k) => k + 1);

  return (
    <div className="container mx-auto p-6 max-sm:p-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Dashboard Management
        </h1>

        <Tabs defaultValue="treatment" className="w-full mt-2">
          <TabsList className="mb-8">
            <TabsTrigger value="treatment">Treatment<span className="hidden sm:inline">&nbsp;Management</span></TabsTrigger>
            <TabsTrigger value="hospital">Hospital<span className="hidden sm:inline">&nbsp;Management</span></TabsTrigger>
            <TabsTrigger value="hotel">Hotel<span className="hidden sm:inline">&nbsp;Management</span></TabsTrigger>
          </TabsList>

          {/* Treatment Tab */}
          <TabsContent value="treatment">
            <Card className="w-full max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-white p-6 max-sm:p-2 shadow-lg transition hover:shadow-xl">
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
                  onSaved={handleSaved}
                />
              </CardContent>
            </Card>
            {/* treatment add or update */}
            <TreatmentCards
              onTreatmentSelect={setSelectedTreatment}
              refreshKey={refreshKey}
            />
          </TabsContent>

          {/* Hospital Tab */}
          <TabsContent value="hospital">
            <Card className="w-full max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-white p-6 max-sm:p-2 shadow-lg transition hover:shadow-xl">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-2xl font-bold text-blue-900">
                  {selectedHospital?._id ? "Update Hospital" : "Add New Hospital"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* hospital form */}
                <HospitalForm
                  selectedHospital={selectedHospital}
                  setSelectedHospital={setSelectedHospital}
                  onSaved={handleSaved}
                  refreshKey={refreshKey}
                />
              </CardContent>
            </Card>
            {/* hospital cards */}
            <HospitalCards
              onHospitalSelect={setSelectedHospital}
              refreshKey={refreshKey}
            />
          </TabsContent>

          {/* Hotel Tab */}
          <TabsContent value="hotel">
            <Card className="w-full max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-white p-6 max-sm:p-2 shadow-lg transition hover:shadow-xl">
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
                  onSaved={handleSaved}
                />
              </CardContent>
            </Card>
            {/* Hotel cards for update */}
            <HotelsCards onHotelSelect={setSelectedHotel} refreshKey={refreshKey} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Create;
