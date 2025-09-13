import React from "react";
import LoginForm from "@/components/LoginForm";
import Navbar from "@/components/Navbar";
import TopNavbar from "@/components/TopNavbar";
import VideoBackground from "@/components/VideoBackground";

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavbar title="Sign In" showBackButton={true} />
      
      <div className="relative flex-1">
        <VideoBackground />
        
        <div className="relative z-10 flex-1 max-w-md mx-auto w-full p-4 flex items-center justify-center min-h-[calc(100vh-7rem)] pt-4 pb-20">
          <LoginForm />
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default Login;