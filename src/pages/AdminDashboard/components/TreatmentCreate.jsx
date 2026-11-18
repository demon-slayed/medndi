import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Check, ChevronsUpDown, X, Edit, Trash } from "lucide-react";
import toast from "react-hot-toast";

const TreatmentCreate = ({ selectedTreatment, setSelectedTreatment }) => {
  const [hospitals, setHospitals] = useState();
  const [selectedHospitalIds, setSelectedHospitalIds] = useState([]);
  const [selectedHospitals, setSelectedHospitals] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  // Add feature
  const handleAddFeature = () => {
    if (
      featureInput.trim() &&
      !treatmentData.features.includes(featureInput.trim())
    ) {
      setTreatmentData({
        ...treatmentData,
        features: [...treatmentData.features, featureInput.trim()],
      });
      setFeatureInput("");
    }
  };

  // Remove feature
  const handleRemoveFeature = (index) => {
    const updated = [...treatmentData.features];
    updated.splice(index, 1);
    setTreatmentData({ ...treatmentData, features: updated });
  };

  const toggleHospital = (id) => {
    setSelectedHospitalIds((prev) => {
      if (!Array.isArray(prev)) return [id]; // safeguard

      if (prev.includes(id)) {
        return prev.filter((hId) => hId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const removeHospital = (hospitalId) => {
    setSelectedHospitalIds((current) =>
      current.filter((id) => id !== hospitalId)
    );
  };

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/hospitals`,
          { withCredentials: true }
        );
        setHospitals(res?.data);
        console.log("hospitals in create is: ", res?.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchHospitals();
  }, []);

  const [treatmentData, setTreatmentData] = useState({
    treatment_id: "",
    treatment_name: "",
    location: "",
    rating: "",
    min_cost: "",
    max_cost: "",
    email: "",
    phone: "",
    duration: "",
    success_rate: "",
    patients: "",
    tags: "",
    experience: "",
    support: "",
    description: "",
    category: "",
    features: [],
    hospitals: "",
    image: "",
  });

  useEffect(() => {
    if (selectedTreatment) {
      console.log("Selected treatment for update is: ", selectedTreatment);
      console.log(
        "data type of selected treatment is: ",
        typeof selectedTreatment
      );

      setTreatmentData((prev) => ({
        ...prev,
        ...selectedTreatment,
        min_cost: selectedTreatment?.estimated_cost?.min,
        max_cost: selectedTreatment?.estimated_cost?.max,
      }));
      setSelectedHospitalIds(selectedTreatment?.available_hospitals);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [selectedTreatment]);

  // Handle form submissions
  const handleTreatmentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Required fields to validate (excluding optional ones like `hospitals`)
    const requiredFields = [
      "treatment_id",
      "treatment_name",
      "location",
      "rating",
      "min_cost",
      "max_cost",
      "email",
      "phone",
      "duration",
      "success_rate",
      "patients",
      "tags",
      "experience",
      "support",
      "description",
      "category",
      "image",
    ];

    // Check for empty fields
    for (let field of requiredFields) {
      if (
        !treatmentData[field] ||
        treatmentData[field].toString().trim() === ""
      ) {
        toast.error(`Please fill out the ${field.replace(/_/g, " ")} field`);
        setIsSubmitting(false);
        return;
      }
    }

    // Features and hospitals can also be validated if you want
    if (!treatmentData.features.length) {
      toast.error("Please add at least one feature");
      setIsSubmitting(false);
      return;
    }

    if (!selectedHospitalIds.length) {
      toast.error("Please select at least one hospital");
      setIsSubmitting(false);
      return;
    }

    try {
      const processedData = {
        treatment_id: treatmentData.treatment_id,
        treatment_name: treatmentData.treatment_name,
        location: treatmentData.location,
        rating: parseFloat(treatmentData.rating),
        estimated_cost: {
          min: parseInt(treatmentData.min_cost),
          max: parseInt(treatmentData.max_cost),
        },
        email: treatmentData.email,
        phone: treatmentData.phone,
        duration: treatmentData.duration,
        success_rate: treatmentData.success_rate,
        features: treatmentData.features,
        available_hospitals: selectedHospitalIds,
        image: treatmentData.image,
        patients: treatmentData.patients,
        tags: treatmentData.tags,
        experience: treatmentData.experience,
        support: treatmentData.support,
        description: treatmentData.description,
        category: treatmentData.category,
      };

      let response;

      if (selectedTreatment && Object.keys(selectedTreatment).length > 0) {
        response = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/treatments/${
            selectedTreatment._id
          }`,
          processedData,
          { withCredentials: true }
        );
        toast.success("Treatment updated successfully!");
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/treatments/create`,
          processedData,
          { withCredentials: true }
        );
        toast.success("Treatment created successfully!");
      }

      console.log("Treatment response:", response.data);

      setTreatmentData({
        treatment_id: "",
        treatment_name: "",
        location: "",
        rating: "",
        min_cost: "",
        max_cost: "",
        email: "",
        phone: "",
        duration: "",
        success_rate: "",
        patients: "",
        tags: "",
        experience: "",
        support: "",
        description: "",
        category: "",
        features: [],
        hospitals: "",
        image: "",
      });

      setSelectedHospitalIds([]);
    } catch (err) {
      console.error("Error submitting treatment:", err);
      toast.error("Something went wrong while submitting treatment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // delete treatment
  const handleDeleteTreatment = async () => {
    if (!selectedTreatment || !selectedTreatment._id) {
      toast.error("No treatment selected to delete.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      // Send DELETE request to delete the treatment
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/treatments/${selectedTreatment._id}`,
        { withCredentials: true }
      );
  
      console.log("Treatment deleted:", response.data);
  
      // Optionally reset treatment data or handle after delete
      setSelectedTreatment({});
      setTreatmentData({
        treatment_id: "",
        treatment_name: "",
        location: "",
        rating: "",
        min_cost: "",
        max_cost: "",
        email: "",
        phone: "",
        duration: "",
        success_rate: "",
        patients: "",
        tags: "",
        experience: "",
        support: "",
        description: "",
        category: "",
        features: [],
        hospitals: "",
        image: "",
      });
  
      toast.success("Treatment deleted successfully!");
    } catch (err) {
      console.error("Error deleting treatment:", err);
      toast.error(err?.response?.data?.message || "Something went wrong while deleting Treatment");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div>
      <form onSubmit={handleTreatmentSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Treatment Id */}
          <div className="space-y-2">
            <Label
              htmlFor="treatment-Id"
              className="text-sm font-semibold text-gray-700"
            >
              Treatment Id
            </Label>
            <Input
              id="treatment-name"
              placeholder="DELTREAT001"
              value={treatmentData.treatment_id}
              onChange={(e) =>
                setTreatmentData({
                  ...treatmentData,
                  treatment_id: e.target.value,
                })
              }
            />
          </div>

          {/* Treatment Name */}
          <div className="space-y-2">
            <Label
              htmlFor="treatment-name"
              className="text-sm font-semibold text-gray-700"
            >
              Treatment Name
            </Label>
            <Input
              id="treatment-name"
              placeholder="Advanced Cardiac Surgery"
              value={treatmentData.treatment_name}
              onChange={(e) =>
                setTreatmentData({
                  ...treatmentData,
                  treatment_name: e.target.value,
                })
              }
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label
              htmlFor="treatment-location"
              className="text-sm font-semibold text-gray-700"
            >
              Location
            </Label>
            <Input
              id="treatment-location"
              placeholder="Maharashtra"
              value={treatmentData.location}
              onChange={(e) =>
                setTreatmentData({
                  ...treatmentData,
                  location: e.target.value,
                })
              }
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label
              htmlFor="treatment-rating"
              className="text-sm font-semibold text-gray-700"
            >
              Rating
            </Label>
            <Input
              id="treatment-rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="4.9"
              value={treatmentData.rating}
              onChange={(e) =>
                setTreatmentData({
                  ...treatmentData,
                  rating: e.target.value,
                })
              }
            />
          </div>

          {/* Estimated Cost */}
          <div className="space-y-2">
            <Label
              htmlFor="treatment-min"
              className="text-sm font-semibold text-gray-700"
            >
              Min Cost
            </Label>
            <Input
              id="treatment-min"
              type="number"
              placeholder="250000"
              value={treatmentData.min_cost}
              onChange={(e) =>
                setTreatmentData({
                  ...treatmentData,
                  min_cost: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="treatment-max"
              className="text-sm font-semibold text-gray-700"
            >
              Max Cost
            </Label>
            <Input
              id="treatment-max"
              type="number"
              placeholder="500000"
              value={treatmentData.max_cost}
              onChange={(e) =>
                setTreatmentData({
                  ...treatmentData,
                  max_cost: e.target.value,
                })
              }
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="treatment-email"
              className="text-sm font-semibold text-gray-700"
            >
              Email
            </Label>
            <Input
              id="treatment-email"
              type="email"
              placeholder="cardiac@hospital.com"
              value={treatmentData.email}
              onChange={(e) =>
                setTreatmentData({
                  ...treatmentData,
                  email: e.target.value,
                })
              }
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label
              htmlFor="treatment-phone"
              className="text-sm font-semibold text-gray-700"
            >
              Phone
            </Label>
            <Input
              id="treatment-phone"
              placeholder="+91 98765 43210"
              value={treatmentData.phone}
              onChange={(e) =>
                setTreatmentData({
                  ...treatmentData,
                  phone: e.target.value,
                })
              }
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label
              htmlFor="treatment-duration"
              className="text-sm font-semibold text-gray-700"
            >
              Duration
            </Label>
            <Input
              id="treatment-duration"
              placeholder="4-6 weeks"
              value={treatmentData.duration}
              onChange={(e) =>
                setTreatmentData({
                  ...treatmentData,
                  duration: e.target.value,
                })
              }
            />
          </div>

          {/* Success Rate */}
          <div className="space-y-2">
            <Label
              htmlFor="treatment-success"
              className="text-sm font-semibold text-gray-700"
            >
              Success Rate
            </Label>
            <Input
              id="treatment-success"
              placeholder="95%"
              value={treatmentData.success_rate}
              onChange={(e) =>
                setTreatmentData({
                  ...treatmentData,
                  success_rate: e.target.value,
                })
              }
            />
          </div>

          {/* Patients */}
          <div className="space-y-2">
            <Label
              htmlFor="treatment-patients"
              className="text-sm font-semibold text-gray-700"
            >
              Patients Treated
            </Label>
            <Input
              id="treatment-patients"
              placeholder="10,000+"
              value={treatmentData.patients}
              onChange={(e) =>
                setTreatmentData({
                  ...treatmentData,
                  patients: e.target.value,
                })
              }
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label
              htmlFor="treatment-tags"
              className="text-sm font-semibold text-gray-700"
            >
              Tags (comma separated)
            </Label>
            <Input
              id="treatment-tags"
              placeholder="cardiac, surgery, emergency"
              value={treatmentData.tags}
              onChange={(e) =>
                setTreatmentData({
                  ...treatmentData,
                  tags: e.target.value,
                })
              }
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label
              htmlFor="treatment-experience"
              className="text-sm font-semibold text-gray-700"
            >
              Experience
            </Label>
            <Input
              id="treatment-experience"
              placeholder="15+ years"
              value={treatmentData.experience}
              onChange={(e) =>
                setTreatmentData({
                  ...treatmentData,
                  experience: e.target.value,
                })
              }
            />
          </div>

          {/* Support */}
          <div className="space-y-2">
            <Label
              htmlFor="treatment-support"
              className="text-sm font-semibold text-gray-700"
            >
              Support
            </Label>
            <Input
              id="treatment-support"
              placeholder="24/7 support, Nurse support"
              value={treatmentData.support}
              onChange={(e) =>
                setTreatmentData({
                  ...treatmentData,
                  support: e.target.value,
                })
              }
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label
              htmlFor="treatment-category"
              className="text-sm font-semibold text-gray-700"
            >
              Category
            </Label>
            <Input
              id="treatment-category"
              placeholder="Cardiology"
              value={treatmentData.category}
              onChange={(e) =>
                setTreatmentData({
                  ...treatmentData,
                  category: e.target.value,
                })
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <Label
              htmlFor="treatment-description"
              className="text-sm font-semibold text-gray-700"
            >
              Description
            </Label>
            <textarea
              id="treatment-description"
              rows={3}
              placeholder="Detailed treatment description..."
              className="w-full border rounded-md p-3"
              value={treatmentData.description}
              onChange={(e) =>
                setTreatmentData({
                  ...treatmentData,
                  description: e.target.value,
                })
              }
            />
          </div>

          {/* Features */}
          <div className="space-y-2 md:col-span-2">
            <Label
              htmlFor="treatment-features"
              className="text-sm font-semibold text-gray-700"
            >
              Features
            </Label>

            <div className="flex gap-2">
              <Input
                id="treatment-features"
                placeholder="Enter a feature and press Add (Ex:- Minimally invasive procedure, Quick recovery time)"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddFeature())
                }
              />
              <Button
                type="button"
                onClick={handleAddFeature}
                className="py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
              >
                Add
              </Button>
            </div>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {treatmentData.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-blue-500 hover:text-red-500"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Hospitals */}
          <div className="space-y-2 md:col-span-2 w-full">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Select Hospitals
              </label>
              {selectedHospitalIds?.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedHospitalIds([])}
                  className="h-8 text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </Button>
              )}
            </div>

            <div className="relative w-full">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between border-gray-300 bg-white hover:bg-gray-50"
                  >
                    {selectedHospitalIds?.length > 0
                      ? `${selectedHospitalIds?.length} hospital${
                          selectedHospitalIds?.length > 1 ? "s" : ""
                        } selected`
                      : "Select hospitals"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="p-0 w-[var(--radix-popover-trigger-width)]"
                  align="start"
                  side="bottom"
                >
                  <Command className="rounded-lg border shadow-md w-full">
                    <CommandInput
                      placeholder="Search hospitals..."
                      className="h-9"
                    />
                    <CommandEmpty className="py-6 text-center text-sm">
                      No hospital found.
                    </CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-64">
                        {hospitals?.map((hospital) => {
                          const isSelected = selectedHospitalIds?.includes(
                            hospital._id
                          );
                          return (
                            <CommandItem
                              key={hospital._id}
                              onSelect={() => toggleHospital(hospital._id)}
                              className="cursor-pointer"
                            >
                              <div
                                className={`flex items-center gap-2 w-full ${
                                  isSelected ? "font-medium" : ""
                                }`}
                              >
                                <div
                                  className={`flex-shrink-0 h-4 w-4 rounded border ${
                                    isSelected
                                      ? "bg-blue-600 border-blue-600 flex items-center justify-center"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isSelected && (
                                    <Check className="h-3 w-3 text-white" />
                                  )}
                                </div>
                                <span
                                  className={isSelected ? "text-blue-600" : ""}
                                >
                                  {hospital.hospital_name}
                                </span>
                              </div>
                            </CommandItem>
                          );
                        })}
                      </ScrollArea>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {selectedHospitals.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-2">
                  Selected hospitals:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedHospitals.map((hospital) => (
                    <Badge
                      key={hospital._id}
                      variant="secondary"
                      className="pl-2 pr-1 py-1 flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      {hospital.hospital_name}
                      <button
                        onClick={() => removeHospital(hospital._id)}
                        className="ml-1 rounded-full hover:bg-blue-200 p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Image URL */}
          <div className="space-y-2 md:col-span-2">
            <Label
              htmlFor="treatment-image"
              className="text-sm font-semibold text-gray-700"
            >
              Image URL
            </Label>
            <Input
              id="treatment-image"
              placeholder="https://example.com/image.jpg"
              value={treatmentData.image}
              onChange={(e) =>
                setTreatmentData({
                  ...treatmentData,
                  image: e.target.value,
                })
              }
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>
              {Object.keys(selectedTreatment).length > 0
                ? "Updating"
                : "Adding"}{" "}
              Treatment...
            </span>
          ) : (
            <>
              {Object.keys(selectedTreatment).length > 0 ? (
                <Edit className="w-4 h-4 mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {Object.keys(selectedTreatment).length > 0 ? "Update" : "Add"}{" "}
              Treatment
            </>
          )}
        </Button>

        {Object.keys(selectedTreatment).length > 0 && (
          <Button
            type="button"
            className="w-full mt-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
            onClick={handleDeleteTreatment}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Deleting Treatment...</span>
            ) : (
              <>
                <Trash className="w-4 h-4 mr-2" />
                Delete Treatment
              </>
            )}
          </Button>
        )}
      </form>
    </div>
  );
};

export default TreatmentCreate;
