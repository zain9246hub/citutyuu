
import React from "react";
import SignupForm from "@/components/SignupForm";
import Navbar from "@/components/Navbar";

const Signup = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 max-w-md mx-auto w-full pb-20 p-4 flex items-center">
        <SignupForm />
      </div>
      <Navbar />
    </div>
  );
};

export default Signup;
