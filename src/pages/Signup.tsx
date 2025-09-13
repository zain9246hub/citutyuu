
import React from "react";
import SignupForm from "@/components/SignupForm";
import Navbar from "@/components/Navbar";
import TopNavbar from "@/components/TopNavbar";

const Signup = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavbar title="Create Account" showBackButton={true} />
      
      <div className="relative flex-1 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500" />
        </div>
        
        <div className="relative z-10 flex-1 max-w-md mx-auto w-full p-4 flex items-center justify-center min-h-[calc(100vh-7rem)] pt-4 pb-20">
          <SignupForm />
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default Signup;
