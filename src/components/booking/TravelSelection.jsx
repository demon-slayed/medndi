import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ArrowRight, 
  Plane, 
  Train, 
  Car, 
  MapPin,
  X,
  Clock,
  AlertCircle,
  ArrowDown
} from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import toast from 'react-hot-toast';

const TravelSelection = () => {
  // Start from any saved choice so coming back to this step doesn't wipe it
  const saved = useAppStore.getState().selectedTravelManagement;
  const hasSaved = Boolean(saved?.travelMode);
  const [needTravel, setNeedTravel] = useState(hasSaved ? true : null);
  const [travelMode, setTravelMode] = useState(hasSaved ? saved.travelMode : null);
  const [showLocalTransport, setShowLocalTransport] = useState(Boolean(saved?.selectedLocalTransport));
  const [selectedLocalTransport, setSelectedLocalTransport] = useState(saved?.selectedLocalTransport ?? null);
  const [sourceCity, setSourceCity] = useState(saved?.sourceCity ?? '');
  const [destinationCity, setDestinationCity] = useState(saved?.destinationCity ?? '');
  const { setSelectedTravelManagement } = useAppStore()

  const handleTravelManagement = () => {
    if (needTravel) {
      const travelData = {
        sourceCity,
        destinationCity,
      };
      travelData.travelMode = travelMode;
      if (showLocalTransport) {
        travelData.selectedLocalTransport = selectedLocalTransport;
      }
  
      setSelectedTravelManagement(travelData);
    } else{
      setSelectedTravelManagement([])
    }
  };
  
  useEffect(()=>{
    handleTravelManagement();
  },[needTravel, travelMode, showLocalTransport, selectedLocalTransport, sourceCity, destinationCity])


  
  
  
  const transportModes = [
    {
      type: 'flight',
      icon: Plane,
      name: 'Flight',
      estimatedTime: '2-3 hours',
      priceRange: '₹4,000 - ₹8,000'
    },
    {
      type: 'train',
      icon: Train,
      name: 'Train',
      estimatedTime: '8-12 hours',
      priceRange: '₹1,200 - ₹2,500'
    }
  ];

  const localTransportOptions = [
    {
      type: "Private Car",
      features: ["Door-to-door service", "24/7 availability"],
      price: "1,499/day"
    },
    {
      type: "Medical Transport",
      features: ["Wheelchair accessible", "Medical staff available"],
      price: "2,999/day"
    }
  ];

  const popularCities = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", 
    "Hyderabad", "Pune", "Ahmedabad"
  ];

  return (
    <div className="">
      {/* Initial Choice */}
      {needTravel === null && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">Do you need travel arrangements?</h2>
          <p className="text-gray-600 mb-8">We can help arrange your journey to and from the medical facility</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setNeedTravel(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
            >
              Yes, I need travel arrangements
            </button>
            <button
              onClick={() => setNeedTravel(false)}
              className="px-6 py-3 border-2 border-gray-200 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40"
            >
              No, I&apos;ll manage on my own
            </button>
          </div>
        </motion.div>
      )}

      {/* Travel Form */}
      <AnimatePresence>
        {needTravel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Travel arrangements</h2>

              <button
                onClick={() => setNeedTravel(null)}
                aria-label="Close travel arrangements"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Source and Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-700 text-sm font-medium">Source City</span>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      value={sourceCity}
                      onChange={(e) => setSourceCity(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3252DF] focus:border-transparent outline-none"
                      placeholder="Enter your city"
                    />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  {/* Popular Cities */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {popularCities.slice(0, 4).map(city => (
                      <button
                        key={city}
                        onClick={() => setSourceCity(city)}
                        className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </label>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-700 text-sm font-medium">Destination City</span>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      value={destinationCity}
                      onChange={(e) => setDestinationCity(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3252DF] focus:border-transparent outline-none"
                      placeholder="Enter destination city"
                    />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </label>
              </div>
            </div>

            {/* Transport Mode Selection */}
            {sourceCity && destinationCity && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {transportModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <motion.div
                      key={mode.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTravelMode(mode.type)}
                      className={`p-6 border rounded-lg cursor-pointer transition-all
                        ${travelMode === mode.type ? 'border-[#3252DF] bg-blue-50' : 'hover:border-gray-300'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${travelMode === mode.type ? 'bg-[#3252DF] text-white' : 'bg-gray-100'}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{mode.name}</h3>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{mode.estimatedTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <AlertCircle className="w-4 h-4" />
                              <span>Estimated {mode.priceRange}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Local Transport Option */}
            {travelMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t pt-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Local Transportation</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-100 rounded-full">
                        <Car className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">City Transport</h4>
                        <p className="text-sm text-gray-600">Need transportation within the city?</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={showLocalTransport}
                        onChange={() => setShowLocalTransport(!showLocalTransport)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3252DF]"></div>
                    </label>
                  </div>

                  <AnimatePresence>
                    {showLocalTransport && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        {localTransportOptions.map((transport, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedLocalTransport(transport.type)}
                            className={`border rounded-lg p-4 transition-colors cursor-pointer hover:border-[#3252DF] ${
                              selectedLocalTransport === transport.type ? 'border-[#3252DF] bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{transport.type}</h4>
                                <ul className="mt-2 space-y-1">
                                  {transport.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                      <Check className="w-4 h-4 text-green-500" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-semibold text-[#3252DF]">₹{transport.price}</div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Summary and Continue Button */}
            {travelMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t pt-6 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-gray-600">Estimated Total</p>
                  <p className="text-xl font-semibold text-[#3252DF]">₹4,999 - ₹8,999</p>
                  <p className="text-xs text-gray-500">Final price will be confirmed during review</p>
                </div>
                <button className="px-6 py-2 bg-[#3252DF] text-white rounded-lg hover:bg-[#2341CE] transition-colors"
                onClick={()=> handleTravelManagement()}
                >
                  Add Travel Arrangements
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message when user opts out */}
      <AnimatePresence>
        {needTravel === false && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Travel Arrangements Skipped</h3>
                <p className="text-gray-600 mt-1">You can always add travel arrangements later</p>
              </div>
              <button
                onClick={() => setNeedTravel(null)}
                className="text-[#3252DF] hover:underline"
              >
                Change Selection
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TravelSelection;
