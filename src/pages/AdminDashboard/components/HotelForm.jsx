import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import toast from "react-hot-toast";

const HotelForm = ({ selectedHotel, setSelectedHotel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amenityInput, setAmenityInput] = useState("");
  const [hospitalInput, setHospitalInput] = useState("");

  const [hotelData, setHotelData] = useState({
    hotel_id: "",
    image: "",
    hotel_name: "",
    description: "",
    location: "",
    distance: "",
    price_per_night: "",
    rating: "",
    amenities: [],
    hospital_nearby: [],
  });

  useEffect(() => {
    if (selectedHotel) {
      console.log("selected hotel for update is: ", selectedHotel);

      setHotelData((prev) => ({
        ...prev,
        ...selectedHotel,
      }));
      // toast.success("Hotel selected for Edit")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [selectedHotel]);

  const addAmenity = () => {
    if (amenityInput.trim() !== "") {
      setHotelData({
        ...hotelData,
        amenities: [...hotelData.amenities, amenityInput.trim()],
      });
      setAmenityInput("");
    }
  };

  const removeAmenity = (index) => {
    const updatedAmenities = [...hotelData.amenities];
    updatedAmenities.splice(index, 1);
    setHotelData({
      ...hotelData,
      amenities: updatedAmenities,
    });
  };

  const addHospital = () => {
    if (hospitalInput.trim() !== "") {
      setHotelData({
        ...hotelData,
        hospital_nearby: [...hotelData.hospital_nearby, hospitalInput.trim()],
      });
      setHospitalInput("");
    }
  };

  const removeHospital = (index) => {
    const updatedHospitals = [...hotelData.hospital_nearby];
    updatedHospitals.splice(index, 1);
    setHotelData({
      ...hotelData,
      hospital_nearby: updatedHospitals,
    });
  };

  const handleKeyPress = (e, addFunction) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFunction();
    }
  };

  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const processedData = {
        ...hotelData,
        price_per_night: Number(hotelData.price_per_night),
        rating: Number(hotelData.rating),
      };

      let response;

      if (selectedHotel && Object.keys(selectedHotel).length > 0) {
        //  Update existing hotel
        response = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/hotels/${selectedHotel._id}`,
          processedData,
          { withCredentials: true }
        );
        toast.success("Hotel updated successfully!");
      } else {
        //  Create new hotel
        response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/hotels/create`,
          processedData,
          { withCredentials: true }
        );
        toast.success("Hotel added successfully!");
      }

      console.log("Response:", response.data);

      // Reset form
      setHotelData({
        hotel_id: "",
        image: "",
        hotel_name: "",
        description: "",
        location: "",
        distance: "",
        price_per_night: "",
        rating: "",
        amenities: [],
        hospital_nearby: [],
      });
    } catch (error) {
      console.error("Error submitting hotel:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHotel = async () => {
    if (!selectedHotel || !selectedHotel._id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete hotel "${selectedHotel.hotel_name}"? This action cannot be undone.`
    );
  
    if (!confirmed) return;
    toast.co

    setIsSubmitting(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/hotels/${selectedHotel._id}`,
        { withCredentials: true }
      );
      toast.success("Hotel deleted successfully");

      // Optional: clear state or refresh list
      setHotelData({
        hotel_id: "",
        image: "",
        hotel_name: "",
        description: "",
        location: "",
        distance: "",
        price_per_night: "",
        rating: "",
        amenities: [],
        hospital_nearby: [],
      });
      setSelectedHotel([]);
    } catch (err) {
      console.error("Error deleting treatment:", err);
      toast.error(err?.response?.data?.message || "Failed to delete treatment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleHotelSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label
            htmlFor="hotel-id"
            className="text-sm font-medium text-gray-600"
          >
            Hotel ID
          </Label>
          <Input
            id="hotel-id"
            placeholder="HO001"
            value={hotelData.hotel_id}
            onChange={(e) =>
              setHotelData({ ...hotelData, hotel_id: e.target.value })
            }
            className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-4">
          <Label
            htmlFor="hotel-name"
            className="text-sm font-medium text-gray-600"
          >
            Hotel Name
          </Label>
          <Input
            id="hotel-name"
            placeholder="Hotel Satwah"
            value={hotelData.hotel_name}
            onChange={(e) =>
              setHotelData({ ...hotelData, hotel_name: e.target.value })
            }
            className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-4 md:col-span-2">
          <Label
            htmlFor="hotel-description"
            className="text-sm font-medium text-gray-600"
          >
            Description
          </Label>
          <Textarea
            id="hotel-description"
            placeholder="A budget-friendly hotel with basic amenities."
            value={hotelData.description}
            onChange={(e) =>
              setHotelData({ ...hotelData, description: e.target.value })
            }
            className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
          />
        </div>

        <div className="space-y-4">
          <Label
            htmlFor="hotel-location"
            className="text-sm font-medium text-gray-600"
          >
            Location
          </Label>
          <Input
            id="hotel-location"
            placeholder="Ansari Nagar, New Delhi"
            value={hotelData.location}
            onChange={(e) =>
              setHotelData({ ...hotelData, location: e.target.value })
            }
            className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          <Label
            htmlFor="hotel-distance"
            className="text-sm font-medium text-gray-600"
          >
            Distance from Hospital
          </Label>
          <Input
            id="hotel-distance"
            placeholder="2.5 km from AIIMS"
            value={hotelData.distance}
            onChange={(e) =>
              setHotelData({ ...hotelData, distance: e.target.value })
            }
            className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          <Label
            htmlFor="hotel-price"
            className="text-sm font-medium text-gray-600"
          >
            Price per Night
          </Label>
          <Input
            id="hotel-price"
            type="number"
            placeholder="1500"
            value={hotelData.price_per_night}
            onChange={(e) =>
              setHotelData({ ...hotelData, price_per_night: e.target.value })
            }
            className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          <Label
            htmlFor="hotel-rating"
            className="text-sm font-medium text-gray-600"
          >
            Rating
          </Label>
          <Input
            id="hotel-rating"
            type="number"
            step="0.1"
            min="1"
            max="5"
            placeholder="3.5"
            value={hotelData.rating}
            onChange={(e) =>
              setHotelData({ ...hotelData, rating: e.target.value })
            }
            className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4 md:col-span-2">
          <Label className="text-sm font-medium text-gray-600">Amenities</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="amenity-input"
              placeholder="Free WiFi"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addAmenity)}
              className="border-2 border-gray-300 rounded-lg p-3 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="button"
              onClick={addAmenity}
              className="py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {hotelData.amenities.map((amenity, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
              >
                <span>{amenity}</span>
                <button
                  type="button"
                  onClick={() => removeAmenity(index)}
                  className="ml-2 text-blue-800 hover:text-blue-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 md:col-span-2">
          <Label className="text-sm font-medium text-gray-600">
            Nearby Hospitals
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="hospital-input"
              placeholder="AIIMS Delhi"
              value={hospitalInput}
              onChange={(e) => setHospitalInput(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addHospital)}
              className="border-2 border-gray-300 rounded-lg p-3 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="button"
              onClick={addHospital}
              className="py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {hotelData.hospital_nearby.map((hospital, index) => (
              <div
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center"
              >
                <span>{hospital}</span>
                <button
                  type="button"
                  onClick={() => removeHospital(index)}
                  className="ml-2 text-green-800 hover:text-green-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label
            htmlFor="hotel-image"
            className="text-sm font-medium text-gray-600"
          >
            Image URL
          </Label>
          <Input
            id="hotel-image"
            placeholder="https://example.com/hotel.jpg"
            value={hotelData.image}
            onChange={(e) =>
              setHotelData({ ...hotelData, image: e.target.value })
            }
            className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            {Object.keys(selectedHotel).length > 0 ? "Updating" : "Adding"}{" "}
            Hotel...
          </span>
        ) : (
          <>
            {Object.keys(selectedHotel).length > 0 ? (
              <Pencil className="w-4 h-4 mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {Object.keys(selectedHotel).length > 0 ? "Update" : "Add"} Hotel
          </>
        )}
      </Button>

      { Object.keys(selectedHotel).length > 0 && (
        <Button
          type="button"
          onClick={handleDeleteHotel}
          className="w-full mt-2 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Deleting..."
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Hotel
            </>
          )}
        </Button>
      )}
    </form>
  );
};

export default HotelForm;
