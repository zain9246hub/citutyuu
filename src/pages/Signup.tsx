
import React from "react";
import SignupForm from "@/components/SignupForm";
import Navbar from "@/components/Navbar";

const Signup = () => {
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500" />
      </div>
      
      <div className="relative flex-1 max-w-sm mx-auto w-full pb-20 p-3 flex items-center">
        <SignupForm />
      </div>
      <Navbar />
    </div>
  );
};

export default Signup;
