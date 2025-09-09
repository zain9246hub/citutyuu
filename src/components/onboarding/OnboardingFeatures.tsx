import React from 'react';
import { motion } from 'framer-motion';

interface OnboardingFeaturesProps {
  onNext: () => void;
}

const OnboardingFeatures: React.FC<OnboardingFeaturesProps> = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-white rounded-full animate-pulse delay-700" />
        <div className="absolute bottom-60 right-10 w-2 h-2 bg-white rounded-full animate-pulse delay-500" />
      </div>

      {/* Floating Neon Icons */}
      <motion.div
        className="absolute top-24 left-12 sm:left-20"
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
        {/* Megaphone */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
          <motion.div
            className="absolute inset-0 bg-yellow-400 opacity-30 rounded-lg blur-sm"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
          <div className="relative w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-400/20">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.5 3A2.5 2.5 0 0 1 21 5.5V7h.5A1.5 1.5 0 0 1 23 8.5v7a1.5 1.5 0 0 1-1.5 1.5H21v1.5a2.5 2.5 0 0 1-2.5 2.5H16v-2h2.5a.5.5 0 0 0 .5-.5V17H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h16V5.5a.5.5 0 0 0-.5-.5H16V3h2.5z"/>
            </svg>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-16 right-16 sm:right-24"
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
        {/* Location Pin */}
        <div className="w-10 h-12 sm:w-12 sm:h-14 relative">
          <motion.div
            className="absolute inset-0 bg-cyan-400 opacity-30 rounded-full blur-sm"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity
            }}
          />
          <div className="relative w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-400/20">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5c-1.378 0-2.5-1.122-2.5-2.5s1.122-2.5 2.5-2.5 2.5 1.122 2.5 2.5-1.122 2.5-2.5 2.5z"/>
            </svg>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-48 right-8 sm:right-16"
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
        {/* Shop Icon */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 relative">
          <motion.div
            className="absolute inset-0 bg-cyan-400 opacity-30 rounded-lg blur-sm"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity
            }}
          />
          <div className="relative w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-400/20">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* 50% OFF Neon Text */}
      <motion.div
        className="absolute bottom-32 left-8 sm:left-16"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          delay: 2
        }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 bg-red-500 opacity-40 blur-md rounded-lg"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
          <div className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-lg sm:text-xl px-3 py-2 rounded-lg shadow-lg shadow-red-500/30 border border-red-400">
            <div className="text-center">
              <div className="text-xs sm:text-sm">50%</div>
              <div className="text-xs sm:text-sm -mt-1">OFF</div>
            </div>
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
        </div>
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4 sm:space-y-6"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
          Promote Your<br />
          <span className="text-transparent bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text">
            Business
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-blue-100 leading-relaxed max-w-md mx-auto">
          List your business, post ads, deals and explore 200+ cities to find other offer change the city. Get Lots of benefits.
        </p>
      </motion.div>
    </div>
  );
};

export default OnboardingFeatures;