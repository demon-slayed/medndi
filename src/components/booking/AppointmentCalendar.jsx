import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from 'react-hot-toast';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle,
  AlertCircle,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import useAppStore from "@/store/useAppStore";

const AppointmentCalendar = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const  { selectedDateAndTime, setSelectedDateAndTime } = useAppStore();

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // to ignore time in comparison

  const isWeekend = (day) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const isPast = (day) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    if (!isPast(day) && !isWeekend(day)) {
      onDateSelect(newDate);
      setSelectedTime(null);
    }
  };

  const handleTimeSelect = (time) => {
    if (!selectedDate || !time) return;

    const timeParts = time.split(":").map((t) => parseInt(t));
    if (timeParts.length !== 2) return;

    const combinedDate = new Date(selectedDate);
    combinedDate.setHours(timeParts[0], timeParts[1], 0, 0);
    setSelectedTime(combinedDate);
  };

  const handleSelectDateAndTime = (selectedTime) => {
       // Store ISO so it parses in every browser; format only for display
       setSelectedDateAndTime(selectedTime.toISOString());

       toast.success("Date and time confirmed")
  }

  const timeSlots = {
    morning: [
      { time: "09:00", available: true, spots: 4 },
      { time: "10:00", available: true, spots: 2 },
      { time: "11:00", available: false, spots: 0 },
    ],
    afternoon: [
      { time: "14:00", available: true, spots: 3 },
      { time: "15:00", available: true, spots: 5 },
      { time: "16:00", available: true, spots: 1 },
    ],
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
            )
          }
          className="p-2 hover:bg-white rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#3252DF]" />
        </motion.button>

        <div className="flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-[#3252DF]" />
          <h3 className="text-xl font-semibold bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h3>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
            )
          }
          className="p-2 hover:bg-white rounded-full transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-[#3252DF]" />
        </motion.button>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
          {days.map((day) => {
            const currentDate = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              day
            );
            const isSelected =
              selectedDate &&
              currentDate.toDateString() === selectedDate.toDateString();
            const isToday = currentDate.toDateString() === today.toDateString();
            const disabled = isPast(day) || isWeekend(day);

            return (
              <motion.button
                key={day}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredDay(day)}
                onHoverEnd={() => setHoveredDay(null)}
                onClick={() => handleDateSelect(day)}
                disabled={disabled}
                className={`relative max-sm:w-[30px] p-3 max-sm:p-[12%] rounded-lg transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white shadow-lg"
                    : disabled
                    ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                    : "hover:bg-white hover:shadow-md text-gray-700"
                }`}
              >
                <span className={`relative z-10 ${isToday ? "font-bold" : ""}`}>
                  {day}
                </span>
                {isToday && (
                  <div className="absolute inset-0 border-2 border-[#3252DF] rounded-lg" />
                )}
                {hoveredDay === day && !disabled && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg text-xs whitespace-nowrap z-20"
                  >
                    {isToday ? "Today - Available" : "Available for booking"}
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 text-[#3252DF]">
              <Clock className="w-5 h-5" />
              <h4 className="text-lg font-semibold">Available Slots</h4>
            </div>

            <div className="space-y-4">
              {["morning", "afternoon"].map((period, i) => (
                <div key={period}>
                  <div className="flex items-center gap-2 mb-3">
                    {period === "morning" ? (
                      <Sun className="w-4 h-4 text-orange-500" />
                    ) : (
                      <Moon className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {period}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots[period].map((slot) => (
                      <motion.button
                        key={slot.time}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 rounded-lg border transition-all max-sm:flex max-sm:flex-col max-sm:items-center ${
                          selectedTime &&
                          selectedTime.toTimeString().startsWith(slot.time)
                            ? "border-[#3252DF] bg-blue-50 text-[#3252DF]"
                            : slot.available
                            ? "border-gray-200 hover:border-[#3252DF] hover:shadow"
                            : "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <span className="block text-sm font-medium">
                          {slot.time}
                        </span>
                        {slot.available ? (
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                            <Users className="w-3 h-3" />
                            <span>{slot.spots} spots left</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                            <AlertCircle className="w-3 h-3" />
                            <span>Booked</span>
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {selectedTime && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 justify-between p-4 max-sm:p-2 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700 text-sm">
                    Selected:{" "}
                    {selectedTime.toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Kolkata",
                    })}
                  </span>
                </div>
                <motion.button
  whileTap={{ scale: 0.95, backgroundColor: "#1d34a5" }} // scale & color on click
  className="px-4 max-sm:px-2 py-2 max-sm:text-xs bg-[#3252DF] text-white rounded-lg hover:bg-[#2341CE] transition-colors"
  onClick={() => handleSelectDateAndTime(selectedTime)}
>
  Confirm Time
</motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppointmentCalendar;
