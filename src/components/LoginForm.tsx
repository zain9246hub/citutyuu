import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { ForgotPasswordDialog } from "./auth/ForgotPasswordDialog";
import { Mail, Lock, User, Building2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("explorer");
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await login(email, password, role);
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      
      // Redirect to profile for all users
      navigate("/profile");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log in. Please check your credentials.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="max-w-md w-full mx-auto">
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/30 rounded-2xl p-8 shadow-xl">
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-3">
              Welcome Back
            </h1>
            <p className="text-white/80 text-base">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="text-white font-semibold text-sm"
              >
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-white/20 border border-white/30 text-white placeholder:text-white/60 focus:border-blue-400 focus:bg-white/30 rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label 
                  htmlFor="password" 
                  className="text-white font-semibold text-sm"
                >
                  Password
                </Label>
                <ForgotPasswordDialog />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-14 h-12 bg-white/20 border border-white/30 text-white placeholder:text-white/60 focus:border-blue-400 focus:bg-white/30 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Account Type Selection */}
            <div className="space-y-4">
              <Label className="text-white font-semibold text-sm">
                Account Type
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("explorer")}
                  className={cn(
                    "relative p-4 rounded-lg border transition-colors",
                    role === "explorer"
                      ? "bg-blue-500/30 border-blue-400"
                      : "bg-white/10 border-white/30 hover:bg-white/20"
                  )}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-2 rounded-full bg-white/10">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white">
                      Explorer
                    </span>
                    <span className="text-xs text-white/60 text-center">
                      Discover amazing deals
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("business")}
                  className={cn(
                    "relative p-4 rounded-lg border transition-colors",
                    role === "business"
                      ? "bg-green-500/30 border-green-400"
                      : "bg-white/10 border-white/30 hover:bg-white/20"
                  )}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-2 rounded-full bg-white/10">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white">
                      Business
                    </span>
                    <span className="text-xs text-white/60 text-center">
                      Grow your business
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-lg font-semibold" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <span>Sign In</span>
              )}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-white/90 text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-blue-300 font-semibold hover:text-blue-200 underline"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
