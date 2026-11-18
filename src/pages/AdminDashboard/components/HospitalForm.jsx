import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Minus,
  X,
  PlusCircle,
  Badge,
  Pencil,
  Trash2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import toast from "react-hot-toast";
import { getErrorMessage, scrollToTop } from "../utils";

const HospitalForm = ({
  selectedHospital,
  setSelectedHospital,
  onSaved,
  refreshKey,
}) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(selectedHospital?._id);

  const initialHospitalData = {
    hospital_id: "",
    hospital_name: "",
    address: "",
    accreditation: "",
    rating: "",
    treatmentCost: "",
    hospital_image: [""],
    stats: {
      successRate: "",
      experience: "",
      patients: "",
    },
    badges: [""],
    specialties: [""],
    key_highlights: [
      {
        label: "",
        value: "",
        trend: "",
      },
    ],
    description: "",
    highlights: [
      {
        title: "",
        description: "",
      },
    ],
    amenities: [
      {
        label: "",
        description: "",
      },
    ],
    doctors: [
      {
        name: "",
        specialty: "",
        experience: "",
        rating: "",
        image: "",
        qualifications: "",
        expertise: "",
      },
    ],
    contact_number: "",
    email: "",
    Hotels: [],
    website: "",
  };
  const [hospitalData, setHospitalData] = useState(initialHospitalData);

  // Fetch hotels for dropdown
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/hotels`
        );
        console.log("hotel fetched in hospital form is: ", response?.data);

        setHotels(response.data?.hotels || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setLoading(false);
      }
    };

    fetchHotels();
  }, [refreshKey]);

  useEffect(() => {
    if (!selectedHospital?._id) {
      setHospitalData(initialHospitalData);
      return;
    }
    // fill any missing arrays/objects so every input stays controlled
    setHospitalData({
      ...initialHospitalData,
      ...selectedHospital,
      stats: { ...initialHospitalData.stats, ...selectedHospital.stats },
      Hotels: (selectedHospital.Hotels || []).map((hotel) => hotel?._id || hotel),
    });
    scrollToTop();
  }, [selectedHospital]);

  // back to "Add" mode with a blank form
  const resetForm = () => {
    setHospitalData(initialHospitalData);
    setSelectedHospital({});
  };

  // Generic function to handle array field additions
  const handleAddArrayItem = (field, initialValue) => {
    setHospitalData({
      ...hospitalData,
      [field]: [...hospitalData[field], initialValue],
    });
  };

  // Generic function to handle array field removals
  const handleRemoveArrayItem = (field, index) => {
    const newArray = [...hospitalData[field]];
    newArray.splice(index, 1);
    setHospitalData({
      ...hospitalData,
      [field]: newArray,
    });
  };

  // Generic function to update array field items
  const handleArrayItemChange = (field, index, value) => {
    const newArray = [...hospitalData[field]];
    newArray[index] = value;
    setHospitalData({
      ...hospitalData,
      [field]: newArray,
    });
  };

  // Handle object array field changes (key_highlights, highlights, amenities, doctors)
  const handleObjectArrayChange = (field, index, key, value) => {
    const newArray = [...hospitalData[field]];
    newArray[index] = {
      ...newArray[index],
      [key]: value,
    };
    setHospitalData({
      ...hospitalData,
      [field]: newArray,
    });
  };

  // Handle hotel selection changes
  const handleHotelChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setHospitalData({
      ...hospitalData,
      Hotels: selectedOptions,
    });
  };

  const handleHospitalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // don't send server-managed fields back on update
    // eslint-disable-next-line no-unused-vars
    const { _id, __v, created_at, updated_at, ...payload } = hospitalData;

    try {
      if (isEditing) {
        // 🔄 Update hospital
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/hospitals/${selectedHospital._id}`,
          payload,
          { withCredentials: true }
        );
        toast.success("Hospital updated successfully");
      } else {
        // ➕ Create new hospital
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/hospitals/create`,
          payload,
          { withCredentials: true }
        );
        toast.success("Hospital added successfully");
      }

      resetForm();
      onSaved?.();
    } catch (error) {
      console.error("Error submitting hospital:", error);
      toast.error(getErrorMessage(error, "Failed to save hospital"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHospital = async () => {
    if (!isEditing) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete hospital "${selectedHospital.hospital_name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/hospitals/${selectedHospital._id}`,
        { withCredentials: true }
      );
      toast.success("Hospital deleted successfully");
      resetForm();
      onSaved?.();
    } catch (error) {
      console.error("Error deleting hospital:", error);
      toast.error(getErrorMessage(error, "Failed to delete hospital"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleHospitalSubmit} className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="hospital-id"
              className="text-sm font-semibold text-gray-700"
            >
              Hospital ID *
            </Label>
            <Input
              id="hospital-id"
              placeholder="HOSP001"
              value={hospitalData?.hospital_id}
              onChange={(e) =>
                setHospitalData({
                  ...hospitalData,
                  hospital_id: e.target.value,
                })
              }
              className="focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="hospital-name"
              className="text-sm font-semibold text-gray-700"
            >
              Hospital Name *
            </Label>
            <Input
              id="hospital-name"
              placeholder="Apollo Specialty Hospital"
              value={hospitalData?.hospital_name}
              onChange={(e) =>
                setHospitalData({
                  ...hospitalData,
                  hospital_name: e.target.value,
                })
              }
              className="focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="hospital-address"
              className="text-sm font-semibold text-gray-700"
            >
              Address *
            </Label>
            <Input
              id="hospital-address"
              placeholder="City Center, Pune"
              value={hospitalData.address}
              onChange={(e) =>
                setHospitalData({
                  ...hospitalData,
                  address: e.target.value,
                })
              }
              className="focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="hospital-accreditation"
              className="text-sm font-semibold text-gray-700"
            >
              Accreditation *
            </Label>
            <Input
              id="hospital-accreditation"
              placeholder="JCI & NABH Accredited"
              value={hospitalData.accreditation}
              onChange={(e) =>
                setHospitalData({
                  ...hospitalData,
                  accreditation: e.target.value,
                })
              }
              className="focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="hospital-rating"
              className="text-sm font-semibold text-gray-700"
            >
              Rating *
            </Label>
            <Input
              id="hospital-rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="4.8"
              value={hospitalData.rating}
              onChange={(e) =>
                setHospitalData({
                  ...hospitalData,
                  rating: e.target.value,
                })
              }
              className="focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="hospital-cost"
              className="text-sm font-semibold text-gray-700"
            >
              Treatment Cost *
            </Label>
            <Input
              id="hospital-cost"
              type="number"
              placeholder="245000"
              value={hospitalData.treatmentCost}
              onChange={(e) =>
                setHospitalData({
                  ...hospitalData,
                  treatmentCost: e.target.value,
                })
              }
              className="focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="contact-number"
              className="text-sm font-semibold text-gray-700"
            >
              Contact Number
            </Label>
            <Input
              id="contact-number"
              placeholder="+91-11-26588500"
              value={hospitalData.contact_number}
              onChange={(e) =>
                setHospitalData({
                  ...hospitalData,
                  contact_number: e.target.value,
                })
              }
              className="focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="hospital@example.com"
              value={hospitalData.email}
              onChange={(e) =>
                setHospitalData({
                  ...hospitalData,
                  email: e.target.value,
                })
              }
              className="focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="website"
              className="text-sm font-semibold text-gray-700"
            >
              Website
            </Label>
            <Input
              id="website"
              placeholder="https://www.hospital.com"
              value={hospitalData.website}
              onChange={(e) =>
                setHospitalData({
                  ...hospitalData,
                  website: e.target.value,
                })
              }
              className="focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Description</h2>
        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-sm font-semibold text-gray-700"
          >
            Hospital Description
          </Label>
          <Textarea
            id="description"
            placeholder="Enter detailed description of the hospital..."
            value={hospitalData.description}
            onChange={(e) =>
              setHospitalData({
                ...hospitalData,
                description: e.target.value,
              })
            }
            className="min-h-32 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Hospital Images */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Hospital Images *</h2>
          <Button
            type="button"
            onClick={() => handleAddArrayItem("hospital_image", "")}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Image
          </Button>
        </div>
        {hospitalData?.hospital_image?.map((image, index) => (
          <div key={`image-${index}`} className="flex items-center mb-3 gap-2">
            <Input
              placeholder="Image URL"
              value={image}
              onChange={(e) =>
                handleArrayItemChange("hospital_image", index, e.target.value)
              }
              className="flex-grow focus:ring-blue-500"
              required
            />
            <Button
              type="button"
              onClick={() => handleRemoveArrayItem("hospital_image", index)}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={hospitalData.hospital_image.length <= 1}
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Hospital Statistics *
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="success-rate"
              className="text-sm font-semibold text-gray-700"
            >
              Success Rate
            </Label>
            <Input
              id="success-rate"
              placeholder="98%"
              value={hospitalData?.stats?.successRate}
              onChange={(e) =>
                setHospitalData({
                  ...hospitalData,
                  stats: {
                    ...hospitalData.stats,
                    successRate: e.target.value,
                  },
                })
              }
              className="focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="experience"
              className="text-sm font-semibold text-gray-700"
            >
              Experience
            </Label>
            <Input
              id="experience"
              placeholder="25+ Years"
              value={hospitalData?.stats?.experience}
              onChange={(e) =>
                setHospitalData({
                  ...hospitalData,
                  stats: {
                    ...hospitalData.stats,
                    experience: e.target.value,
                  },
                })
              }
              className="focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="patients"
              className="text-sm font-semibold text-gray-700"
            >
              Patients Treated
            </Label>
            <Input
              id="patients"
              placeholder="50k+"
              value={hospitalData?.stats?.patients}
              onChange={(e) =>
                setHospitalData({
                  ...hospitalData,
                  stats: {
                    ...hospitalData.stats,
                    patients: e.target.value,
                  },
                })
              }
              className="focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Badges *</h2>
          <Button
            type="button"
            onClick={() => handleAddArrayItem("badges", "")}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Badge
          </Button>
        </div>
        {hospitalData?.badges?.map((badge, index) => (
          <div key={`badge-${index}`} className="flex items-center mb-3 gap-2">
            <Input
              placeholder="Badge text (e.g. Top Medical Institution)"
              value={badge}
              onChange={(e) =>
                handleArrayItemChange("badges", index, e.target.value)
              }
              className="flex-grow focus:ring-blue-500"
              required
            />
            <Button
              type="button"
              onClick={() => handleRemoveArrayItem("badges", index)}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={hospitalData.badges.length <= 1}
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Specialties */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Specialties *</h2>
          <Button
            type="button"
            onClick={() => handleAddArrayItem("specialties", "")}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Specialty
          </Button>
        </div>
        {hospitalData?.specialties?.map((specialty, index) => (
          <div
            key={`specialty-${index}`}
            className="flex items-center mb-3 gap-2"
          >
            <Input
              placeholder="Specialty (e.g. Cardiology)"
              value={specialty}
              onChange={(e) =>
                handleArrayItemChange("specialties", index, e.target.value)
              }
              className="flex-grow focus:ring-blue-500"
              required
            />
            <Button
              type="button"
              onClick={() => handleRemoveArrayItem("specialties", index)}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={hospitalData.specialties.length <= 1}
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Key Highlights */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Key Highlights *</h2>
          <Button
            type="button"
            onClick={() =>
              handleAddArrayItem("key_highlights", {
                label: "",
                value: "",
                trend: "",
              })
            }
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Highlight
          </Button>
        </div>
        {hospitalData?.key_highlights?.map((highlight, index) => (
          <div
            key={`key-highlight-${index}`}
            className="border p-4 rounded-md mb-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Highlight #{index + 1}</h3>
              <Button
                type="button"
                onClick={() => handleRemoveArrayItem("key_highlights", index)}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={hospitalData.key_highlights.length <= 1}
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Label
                </Label>
                <Input
                  placeholder="Faculty Members"
                  value={highlight.label}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      "key_highlights",
                      index,
                      "label",
                      e.target.value
                    )
                  }
                  className="focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Value
                </Label>
                <Input
                  placeholder="600+"
                  value={highlight.value}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      "key_highlights",
                      index,
                      "value",
                      e.target.value
                    )
                  }
                  className="focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Trend
                </Label>
                <Input
                  placeholder="Highly experienced faculty"
                  value={highlight.trend}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      "key_highlights",
                      index,
                      "trend",
                      e.target.value
                    )
                  }
                  className="focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Highlights */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Highlights *</h2>
          <Button
            type="button"
            onClick={() =>
              handleAddArrayItem("highlights", {
                title: "",
                description: "",
              })
            }
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Highlight
          </Button>
        </div>
        {hospitalData?.highlights?.map((highlight, index) => (
          <div
            key={`highlight-${index}`}
            className="border p-4 rounded-md mb-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Highlight #{index + 1}</h3>
              <Button
                type="button"
                onClick={() => handleRemoveArrayItem("highlights", index)}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={hospitalData.highlights.length <= 1}
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Title
                </Label>
                <Input
                  placeholder="World-Class Infrastructure"
                  value={highlight.title}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      "highlights",
                      index,
                      "title",
                      e.target.value
                    )
                  }
                  className="focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Description
                </Label>
                <Textarea
                  placeholder="Equipped with state-of-the-art facilities..."
                  value={highlight.description}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      "highlights",
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  className="min-h-20 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Amenities */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Amenities *</h2>
          <Button
            type="button"
            onClick={() =>
              handleAddArrayItem("amenities", {
                label: "",
                description: "",
              })
            }
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Amenity
          </Button>
        </div>
        {hospitalData?.amenities?.map((amenity, index) => (
          <div key={`amenity-${index}`} className="border p-4 rounded-md mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Amenity #{index + 1}</h3>
              <Button
                type="button"
                onClick={() => handleRemoveArrayItem("amenities", index)}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={hospitalData.amenities.length <= 1}
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Label
                </Label>
                <Input
                  placeholder="Hostel Facilities"
                  value={amenity.label}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      "amenities",
                      index,
                      "label",
                      e.target.value
                    )
                  }
                  className="focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Description
                </Label>
                <Textarea
                  placeholder="Hostels available for undergraduate, postgraduate students..."
                  value={amenity.description}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      "amenities",
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  className="min-h-20 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Doctors */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Doctors *</h2>
          <Button
            type="button"
            onClick={() =>
              handleAddArrayItem("doctors", {
                name: "",
                specialty: "",
                experience: "",
                rating: "",
                image: "",
                qualifications: "",
                expertise: "",
              })
            }
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Doctor
          </Button>
        </div>
        {hospitalData?.doctors?.map((doctor, index) => (
          <div key={`doctor-${index}`} className="border p-4 rounded-md mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Doctor #{index + 1}</h3>
              <Button
                type="button"
                onClick={() => handleRemoveArrayItem("doctors", index)}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={hospitalData.doctors.length <= 1}
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Name
                </Label>
                <Input
                  placeholder="Dr. Randeep Guleria"
                  value={doctor.name}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      "doctors",
                      index,
                      "name",
                      e.target.value
                    )
                  }
                  className="focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Specialty
                </Label>
                <Input
                  placeholder="Pulmonology and Critical Care Medicine"
                  value={doctor.specialty}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      "doctors",
                      index,
                      "specialty",
                      e.target.value
                    )
                  }
                  className="focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Experience
                </Label>
                <Input
                  placeholder="30 years"
                  value={doctor.experience}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      "doctors",
                      index,
                      "experience",
                      e.target.value
                    )
                  }
                  className="focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Rating
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="4.9"
                  value={doctor.rating}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      "doctors",
                      index,
                      "rating",
                      e.target.value
                    )
                  }
                  className="focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Image URL
                </Label>
                <Input
                  placeholder="https://example.com/doctor.jpg"
                  value={doctor.image}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      "doctors",
                      index,
                      "image",
                      e.target.value
                    )
                  }
                  className="focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Qualifications
                </Label>
                <Input
                  placeholder="MBBS, MD (Pulmonology)"
                  value={doctor.qualifications}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      "doctors",
                      index,
                      "qualifications",
                      e.target.value
                    )
                  }
                  className="focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Expertise
                </Label>
                <Input
                  placeholder="Respiratory Diseases, Critical Care"
                  value={doctor.expertise}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      "doctors",
                      index,
                      "expertise",
                      e.target.value
                    )
                  }
                  className="focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hotels */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Associated Hotels
        </h2>
        <div className="space-y-2">
          <Label
            htmlFor="hotels"
            className="text-sm font-semibold text-gray-700"
          >
            Select Hotels
          </Label>
          <select
            id="hotels"
            multiple
            value={hospitalData.Hotels}
            onChange={handleHotelChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-32"
          >
            {loading ? (
              <option disabled>Loading hotels...</option>
            ) : (
              hotels?.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.hotel_name}
                </option>
              ))
            )}
          </select>
          <p className="text-sm text-gray-500">
            Hold Ctrl/Cmd to select multiple hotels
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-md transition mb-1"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </div>
          ) : (
            <>
              {isEditing ? (
                <>
                  <Pencil className="w-5 h-5 mr-2" />
                  Update Hospital
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Add Hospital
                </>
              )}
            </>
          )}
        </Button>

        {isEditing && (
          <button
            type="button"
            onClick={handleDeleteHospital}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              <>
                <Trash2 className="w-5 h-5 mr-2" />
                Delete Hospital
              </>
            )}
          </button>
        )}

        {isEditing && (
          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            className="w-full mt-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md transition flex items-center justify-center"
          >
            <X className="w-5 h-5 mr-2" />
            Cancel Edit
          </button>
        )}
      </>
    </form>
  );
};

export default HospitalForm;
