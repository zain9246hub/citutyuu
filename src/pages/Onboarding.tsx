import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import OnboardingWelcome from '@/components/onboarding/OnboardingWelcome';
import OnboardingFeatures from '@/components/onboarding/OnboardingFeatures';
import OnboardingLocation from '@/components/onboarding/OnboardingLocation';
import OnboardingCitySelection from '@/components/onboarding/OnboardingCitySelection';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Welcome to DealsApp - Discover Local Deals';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Welcome to DealsApp - Your gateway to discovering amazing local deals and businesses.');
    }
  }, []);

  const steps = [
    { component: OnboardingWelcome, title: "Welcome" },
    { component: OnboardingFeatures, title: "Features" },
    { component: OnboardingLocation, title: "Location" },
    { component: OnboardingCitySelection, title: "City Selection" }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    navigate('/');
  };

  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    navigate('/');
  };

  const CurrentComponent = steps[currentStep].component;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col relative overflow-hidden">
      {/* Mobile viewport meta tag optimization */}
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-lg"
          animate={{
            y: [0, 15, 0],
            x: [0, -8, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-sm"
          animate={{
            y: [0, -10, 0],
            x: [0, 5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-2xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-4 sm:p-6 relative z-10">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="opacity-70 hover:opacity-100 disabled:opacity-30"
          size="sm"
        >
          Back
        </Button>
        
        {/* Progress Dots */}
        <div className="flex space-x-1 sm:space-x-2">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-6 sm:w-8 bg-blue-600'
                  : index < currentStep
                    ? 'w-4 sm:w-6 bg-blue-400'
                    : 'w-1.5 sm:w-2 bg-gray-300'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          onClick={skipOnboarding}
          className="text-gray-500 hover:text-gray-700"
          size="sm"
        >
          Skip
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:p-6 relative z-10">
        <div className="w-full max-w-sm sm:max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              transition={{ 
                duration: 0.4, 
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
            >
              <CurrentComponent onNext={nextStep} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-4 py-6 sm:p-6 relative z-10">
        <div className="flex justify-center">
          {currentStep === steps.length - 1 ? (
            <Button
              onClick={completeOnboarding}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:px-8 text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 min-h-[48px]"
              size="lg"
            >
              Get Started
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          )}
        </div>
      </div>
    </main>
  );
};

export default Onboarding;