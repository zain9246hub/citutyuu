import React from 'react';
import { motion } from 'framer-motion';

interface OnboardingLocationProps {
  onNext: () => void;
}

const OnboardingLocation: React.FC<OnboardingLocationProps> = () => {
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
          className="absolute w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-80"
          animate={{
            scale: [1, 1.06, 1],
            rotate: [0, 2, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* 3D-style Character with Phone and Calendar */}
        <motion.div
          className="relative z-10"
          animate={{
            y: [0, -12, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="relative">
            {/* Head */}
            <motion.div
              className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full mx-auto mb-2 relative"
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {/* Hair */}
              <div className="absolute -top-1 left-2 w-10 h-6 bg-gradient-to-br from-amber-800 to-amber-900 rounded-t-full" />
              {/* Eyes */}
              <div className="absolute top-4 left-3 w-2 h-2 bg-slate-800 rounded-full" />
              <div className="absolute top-4 right-3 w-2 h-2 bg-slate-800 rounded-full" />
              {/* Smile */}
              <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-slate-800 rounded-full" />
            </motion.div>
            
            {/* Body */}
            <div className="w-14 h-16 sm:w-18 sm:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-t-full rounded-b-lg mx-auto relative">
              {/* Left arm with phone */}
              <motion.div
                className="absolute -left-5 top-3 w-3 h-12 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full transform rotate-12"
                animate={{ rotate: [12, 20, 12] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Phone */}
                <div className="absolute -left-1 top-8 w-4 h-6 bg-slate-800 rounded-sm">
                  <div className="w-3 h-4 bg-blue-400 rounded-sm m-0.5" />
                </div>
              </motion.div>
              
              {/* Right arm pointing */}
              <motion.div
                className="absolute -right-5 top-3 w-3 h-12 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full transform -rotate-12"
                animate={{ rotate: [-12, -20, -12] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Shirt details */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-2 h-8 bg-purple-400 rounded-full opacity-50" />
            </div>
            
            {/* Legs */}
            <div className="flex justify-center space-x-1 -mt-1">
              <motion.div
                className="w-3 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full"
                animate={{ rotate: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="w-3 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full"
                animate={{ rotate: [0, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              />
            </div>
            
            {/* Shoes */}
            <div className="flex justify-center space-x-3 -mt-1">
              <div className="w-5 h-2.5 bg-gradient-to-r from-red-600 to-red-700 rounded-full" />
              <div className="w-5 h-2.5 bg-gradient-to-r from-red-600 to-red-700 rounded-full" />
            </div>
          </div>
        </motion.div>

        {/* Floating Calendar */}
        <motion.div
          className="absolute top-16 right-12"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 8, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 0.5
          }}
        >
          <div className="w-12 h-10 bg-white rounded border-2 border-red-400 shadow-lg relative">
            {/* Calendar header */}
            <div className="w-full h-3 bg-red-400 rounded-t"></div>
            {/* Calendar rings */}
            <div className="absolute -top-1 left-2 w-1 h-2 bg-red-400 rounded-full"></div>
            <div className="absolute -top-1 right-2 w-1 h-2 bg-red-400 rounded-full"></div>
            {/* Calendar grid */}
            <div className="p-1 grid grid-cols-3 gap-0.5 mt-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-gray-300 rounded-sm" />
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Floating Map Pin */}
        <motion.div
          className="absolute bottom-20 left-16"
          animate={{
            y: [0, -20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 1
          }}
        >
          <div className="relative">
            <div className="w-8 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full rounded-b-none relative">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-red-600"></div>
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </motion.div>

        {/* Floating Store Icon */}
        <motion.div
          className="absolute top-28 left-12"
          animate={{
            y: [0, -10, 0],
            x: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: 1.5
          }}
        >
          <div className="w-10 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded shadow-lg relative">
            {/* Store roof */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-5 border-r-5 border-b-4 border-transparent border-b-orange-600"></div>
            {/* Store door */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-orange-700 rounded-t"></div>
          </div>
        </motion.div>

        {/* Floating Location Dots */}
        <motion.div
          className="absolute bottom-32 right-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 2
          }}
        >
          <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg"></div>
        </motion.div>

        <motion.div
          className="absolute top-20 left-20"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: 0.5
          }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full shadow-lg"></div>
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
          Find Your Local Deals
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2 sm:px-4">
          Discover deals and businesses in your area. We'll help you find 
          exactly what you're looking for, right in your neighborhood.
        </p>
      </motion.div>
    </div>
  );
};

export default OnboardingLocation;