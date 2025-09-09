import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Check, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { STATES_WITH_ALL, getCitiesForState, ALL_CITIES } from '@/utils/indiaGeo';

interface OnboardingCitySelectionProps {
  onNext: () => void;
}

const OnboardingCitySelection: React.FC<OnboardingCitySelectionProps> = ({ onNext }) => {
  console.log('[OnboardingCitySelection] Component rendered');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [showSelected, setShowSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>(() => localStorage.getItem('selectedState') || 'All States');


  // Filter and sort cities based on search query - prioritize exact matches
  const filteredCities = useMemo(() => {
    const trimmedQuery = searchQuery.trim();

    const source = selectedState === 'All States' ? ALL_CITIES : getCitiesForState(selectedState);

    if (!trimmedQuery) {
      return source;
    }

    const query = trimmedQuery.toLowerCase();
    const filtered = source.filter(city => 
      city.toLowerCase().includes(query)
    );

    // Sort to prioritize better matches
    const sorted = filtered.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      
      // Exact match first (case insensitive)
      if (aLower === query) return -1;
      if (bLower === query) return 1;
      
      // Starts with query second
      const aStartsWith = aLower.startsWith(query);
      const bStartsWith = bLower.startsWith(query);
      if (aStartsWith && !bStartsWith) return -1;
      if (bStartsWith && !aStartsWith) return 1;
      
      // Alphabetical order for the rest
      return a.localeCompare(b);
    });

    console.log('[OnboardingCitySelection] Filtered cities:', {
      searchQuery: trimmedQuery,
      selectedState,
      totalCities: source.length,
      filteredCount: sorted.length,
      firstFew: sorted.slice(0, 5)
    });
    return sorted;
  }, [searchQuery, selectedState]);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowSelected(true);
    // Save selected city and state to localStorage
    localStorage.setItem('selectedCity', city);
    localStorage.setItem('selectedState', selectedState);
    // Auto proceed after selection
    setTimeout(() => {
      onNext();
    }, 1500);
  };

  return (
    <div className="text-center space-y-6 sm:space-y-8">
      {/* Hero Illustration Area */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="relative h-64 sm:h-80 flex items-center justify-center"
      >
        {/* Main Circle Background */}
        <motion.div
          className="absolute w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full opacity-80"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 3, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* 3D City Skyline */}
        <motion.div
          className="relative z-10"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="relative flex items-end space-x-0.5 sm:space-x-1 mb-4 scale-75 sm:scale-100">
            {/* Building 1 */}
            <motion.div
              className="w-8 h-16 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm relative"
              animate={{ scaleY: [1, 1.1, 1] }}
              transition={{ duration: 6, repeat: Infinity, delay: 0 }}
            >
              {/* Windows */}
              <div className="absolute top-2 left-1 w-2 h-2 bg-yellow-300 rounded-sm opacity-80" />
              <div className="absolute top-2 right-1 w-2 h-2 bg-yellow-300 rounded-sm opacity-60" />
              <div className="absolute top-6 left-1 w-2 h-2 bg-yellow-300 rounded-sm opacity-70" />
              <div className="absolute top-10 right-1 w-2 h-2 bg-yellow-300 rounded-sm opacity-90" />
            </motion.div>

            {/* Building 2 (Tallest) */}
            <motion.div
              className="w-10 h-24 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-sm relative"
              animate={{ scaleY: [1, 1.05, 1] }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            >
              {/* Antenna */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-600" />
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full" />
              {/* Windows */}
              <div className="absolute top-2 left-1 w-2 h-2 bg-yellow-300 rounded-sm opacity-80" />
              <div className="absolute top-2 right-1 w-2 h-2 bg-yellow-300 rounded-sm opacity-90" />
              <div className="absolute top-6 left-1 w-2 h-2 bg-yellow-300 rounded-sm opacity-60" />
              <div className="absolute top-6 right-1 w-2 h-2 bg-yellow-300 rounded-sm opacity-70" />
              <div className="absolute top-10 left-1 w-2 h-2 bg-yellow-300 rounded-sm opacity-85" />
              <div className="absolute top-14 right-1 w-2 h-2 bg-yellow-300 rounded-sm opacity-75" />
            </motion.div>

            {/* Building 3 */}
            <motion.div
              className="w-6 h-12 bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm relative"
              animate={{ scaleY: [1, 1.08, 1] }}
              transition={{ duration: 7, repeat: Infinity, delay: 1 }}
            >
              {/* Windows */}
              <div className="absolute top-2 left-1 w-1.5 h-1.5 bg-yellow-300 rounded-sm opacity-70" />
              <div className="absolute top-2 right-1 w-1.5 h-1.5 bg-yellow-300 rounded-sm opacity-80" />
              <div className="absolute top-6 left-1 w-1.5 h-1.5 bg-yellow-300 rounded-sm opacity-60" />
            </motion.div>

            {/* Building 4 */}
            <motion.div
              className="w-7 h-20 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm relative"
              animate={{ scaleY: [1, 1.03, 1] }}
              transition={{ duration: 8, repeat: Infinity, delay: 1.5 }}
            >
              {/* Windows */}
              <div className="absolute top-2 left-1 w-1.5 h-1.5 bg-yellow-300 rounded-sm opacity-90" />
              <div className="absolute top-2 right-1 w-1.5 h-1.5 bg-yellow-300 rounded-sm opacity-70" />
              <div className="absolute top-6 left-1 w-1.5 h-1.5 bg-yellow-300 rounded-sm opacity-80" />
              <div className="absolute top-6 right-1 w-1.5 h-1.5 bg-yellow-300 rounded-sm opacity-60" />
              <div className="absolute top-10 left-1 w-1.5 h-1.5 bg-yellow-300 rounded-sm opacity-85" />
            </motion.div>

            {/* Building 5 */}
            <motion.div
              className="w-5 h-14 bg-gradient-to-t from-red-600 to-red-400 rounded-t-sm relative"
              animate={{ scaleY: [1, 1.12, 1] }}
              transition={{ duration: 6.5, repeat: Infinity, delay: 2 }}
            >
              {/* Windows */}
              <div className="absolute top-2 left-1 w-1 h-1 bg-yellow-300 rounded-sm opacity-75" />
              <div className="absolute top-2 right-1 w-1 h-1 bg-yellow-300 rounded-sm opacity-85" />
              <div className="absolute top-6 left-1 w-1 h-1 bg-yellow-300 rounded-sm opacity-65" />
              <div className="absolute top-10 right-1 w-1 h-1 bg-yellow-300 rounded-sm opacity-80" />
            </motion.div>
          </div>

          {/* Ground/Base */}
          <div className="w-40 h-2 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full" />
        </motion.div>

        {/* Floating Location Pins */}
        <motion.div
          className="absolute top-12 right-16"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 0.5
          }}
        >
          <div className="relative">
            <div className="w-6 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full rounded-b-none relative">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-4 border-transparent border-t-red-600"></div>
              <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-16 left-12"
          animate={{
            y: [0, -12, 0],
            rotate: [0, -8, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 1
          }}
        >
          <div className="relative">
            <div className="w-5 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full rounded-b-none relative">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2.5 border-r-2.5 border-t-3 border-transparent border-t-green-600"></div>
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-20 left-20"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: 1.5
          }}
        >
          <div className="relative">
            <div className="w-4 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full rounded-b-none relative">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-blue-600"></div>
              <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </motion.div>

        {/* Floating Map */}
        <motion.div
          className="absolute bottom-24 right-8"
          animate={{
            y: [0, -18, 0],
            x: [0, 8, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            delay: 2
          }}
        >
          <div className="w-10 h-8 bg-white rounded shadow-lg border-2 border-gray-300 relative">
            {/* Map lines */}
            <div className="absolute top-1 left-1 w-2 h-0.5 bg-blue-400"></div>
            <div className="absolute top-2 left-2 w-3 h-0.5 bg-green-400"></div>
            <div className="absolute top-3.5 left-1 w-4 h-0.5 bg-red-400"></div>
            <div className="absolute top-5 left-1.5 w-2 h-0.5 bg-purple-400"></div>
            {/* Map dot */}
            <div className="absolute top-2.5 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Choose Your City
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2 sm:px-4">
          Select your city to discover the best deals and local businesses around you.
        </p>
      </motion.div>

      {/* City Selection */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-4 px-2 sm:px-0"
      >
        <AnimatePresence>
          {!showSelected ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 max-w-sm mx-auto"
            >
              {/* State Select */}
              <div className="relative">
                <Select
                  value={selectedState}
                  onValueChange={(state) => {
                    setSelectedState(state);
                    localStorage.setItem('selectedState', state);
                  }}
                >
                  <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] z-50 bg-popover">
                    {STATES_WITH_ALL.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search City */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for your city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl"
                />
              </div>

              {/* Cities Grid/List */}
              <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-xl">
                {filteredCities.length > 0 ? (
                  <div className="space-y-2">
                    {filteredCities.map((city, index) => (
                      <motion.div
                        key={city}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.05, 0.5) }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCitySelect(city)}
                          className="w-full h-12 text-left justify-start text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 border-gray-200 rounded-xl"
                        >
                          <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                          {city}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                      No cities found matching "{searchQuery}"
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Try a different search term
                    </p>
                  </div>
                )}
              </div>

              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Clear search and show all cities
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center space-x-3 py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center"
              >
                <Check className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </motion.div>
              <div className="text-left">
                <p className="text-base sm:text-lg font-semibold text-gray-800">{selectedCity} Selected!</p>
                <p className="text-xs sm:text-sm text-gray-600">Setting up your experience...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default OnboardingCitySelection;