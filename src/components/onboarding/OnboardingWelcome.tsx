import React from 'react';
import { motion } from 'framer-motion';

interface OnboardingWelcomeProps {
  onNext: () => void;
}

const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-white rounded-full animate-pulse delay-700" />
        <div className="absolute bottom-60 right-10 w-2 h-2 bg-white rounded-full animate-pulse delay-500" />
      </div>

      {/* Floating Icons */}
      <motion.div
        className="absolute top-32 left-16 sm:left-24"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: 0.5
        }}
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white text-xl sm:text-2xl font-bold">$</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-24 right-12 sm:right-20"
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
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white text-xl sm:text-2xl font-bold">%</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-40 right-32 sm:right-40"
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
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg relative">
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">★</span>
          </div>
        </div>
      </motion.div>

      {/* City Skyline */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="relative mb-12 sm:mb-16"
      >
        <div className="relative flex items-end justify-center space-x-1 sm:space-x-2">
          {/* Buildings */}
          <motion.div
            className="w-8 h-16 sm:w-12 sm:h-24 bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.2 }}
          >
            <div className="w-2 h-2 bg-yellow-300 rounded-full mx-auto mt-2 opacity-80" />
            <div className="w-2 h-2 bg-yellow-300 rounded-full mx-auto mt-1 opacity-60" />
          </motion.div>
          
          <motion.div
            className="w-6 h-12 sm:w-8 sm:h-18 bg-gradient-to-t from-blue-700 to-blue-600 rounded-t-lg"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
          >
            <div className="w-1 h-1 bg-yellow-300 rounded-full mx-auto mt-2 opacity-80" />
          </motion.div>
          
          <motion.div
            className="w-10 h-20 sm:w-14 sm:h-28 bg-gradient-to-t from-blue-800 to-blue-700 rounded-t-lg relative"
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4.5, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-yellow-300 rounded-full mx-auto mt-3 opacity-80" />
            <div className="w-2 h-2 bg-yellow-300 rounded-full mx-auto mt-1 opacity-60" />
            <div className="w-2 h-2 bg-yellow-300 rounded-full mx-auto mt-1 opacity-40" />
            {/* Antenna */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-gray-300" />
          </motion.div>
          
          <motion.div
            className="w-7 h-14 sm:w-10 sm:h-20 bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, delay: 0.8 }}
          >
            <div className="w-1 h-1 bg-yellow-300 rounded-full mx-auto mt-2 opacity-80" />
            <div className="w-1 h-1 bg-yellow-300 rounded-full mx-auto mt-1 opacity-60" />
          </motion.div>
          
          <motion.div
            className="w-9 h-18 sm:w-12 sm:h-26 bg-gradient-to-t from-blue-700 to-blue-600 rounded-t-lg"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, delay: 0.3 }}
          >
            <div className="w-2 h-2 bg-yellow-300 rounded-full mx-auto mt-2 opacity-80" />
            <div className="w-2 h-2 bg-yellow-300 rounded-full mx-auto mt-1 opacity-60" />
          </motion.div>
          
          <motion.div
            className="w-6 h-10 sm:w-8 sm:h-14 bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, delay: 1 }}
          >
            <div className="w-1 h-1 bg-yellow-300 rounded-full mx-auto mt-1 opacity-80" />
          </motion.div>
        </div>
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4 sm:space-y-6 mb-8 sm:mb-12"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
          Welcome to<br />
          <span className="text-transparent bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text">
            CityOffer
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-blue-100 leading-relaxed max-w-md mx-auto">
          Find the best deals & connect with your city!
        </p>
      </motion.div>
    </div>
  );
};

export default OnboardingWelcome;