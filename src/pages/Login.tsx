import React from "react";
import LoginForm from "@/components/LoginForm";
import Navbar from "@/components/Navbar";
import VideoBackground from "@/components/VideoBackground";

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <VideoBackground />
      <div className="flex-1 max-w-sm mx-auto w-full p-4 flex items-center justify-center relative z-10 min-h-screen">
        <LoginForm />
      </div>
      {/* Ensure navbar is above other elements with higher z-index */}
      <div className="relative z-20">
        <Navbar />
      </div>
    </div>
  );
};

export default Login;