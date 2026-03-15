import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { User, Mail, Lock, Building2, Eye, EyeOff, UserCheck, MapPin, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_CITIES } from "@/utils/cityData";

const SignupForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, isLoading } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState<UserRole>("explorer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword || !city) {
      toast({
        title: "Error",
        description: "Please fill in all fields including city",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await signUp(name, email, password, role, city);
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      navigate("/profile");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="w-full">
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 border border-white/30 rounded-3xl p-5 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-purple-500/30 to-pink-500/30 rounded-3xl opacity-80 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="text-center mb-5">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent mb-1">
              Create Account
            </h1>
            <p className="text-white/90 text-xs font-medium">
              Join the adventure and discover amazing deals
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-white font-semibold text-xs">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-white/70" />
                <Input
                  id="name" type="text" placeholder="John Doe" value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 h-10 bg-white/20 border-2 border-white/30 text-white placeholder:text-white/60 focus:border-purple-400 focus:bg-white/30 focus:shadow-lg focus:shadow-purple-400/20 rounded-xl font-medium text-xs group-hover:border-white/50 transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-white font-semibold text-xs">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-white/70" />
                <Input
                  id="email" type="email" placeholder="your.email@example.com" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-10 bg-white/20 border-2 border-white/30 text-white placeholder:text-white/60 focus:border-yellow-400 focus:bg-white/30 focus:shadow-lg focus:shadow-yellow-400/20 rounded-xl font-medium text-xs group-hover:border-white/50 transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-white font-semibold text-xs">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-white/70" />
                <Input
                  id="password" type={showPassword ? "text" : "password"} placeholder="Min 6 characters" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10 h-10 bg-white/20 border-2 border-white/30 text-white placeholder:text-white/60 focus:border-pink-400 focus:bg-white/30 focus:shadow-lg focus:shadow-pink-400/20 rounded-xl font-medium text-xs group-hover:border-white/50 transition-all duration-300"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white hover:scale-110 transition-all duration-300 p-1 rounded-full hover:bg-white/10">
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-white font-semibold text-xs">Confirm Password</Label>
              <div className="relative group">
                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-white/70" />
                <Input
                  id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 pr-10 h-10 bg-white/20 border-2 border-white/30 text-white placeholder:text-white/60 focus:border-emerald-400 focus:bg-white/30 focus:shadow-lg focus:shadow-emerald-400/20 rounded-xl font-medium text-xs group-hover:border-white/50 transition-all duration-300"
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white hover:scale-110 transition-all duration-300 p-1 rounded-full hover:bg-white/10">
                  {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* City Selection */}
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-white font-semibold text-xs">Your City</Label>
              <Popover open={cityOpen} onOpenChange={setCityOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={cityOpen}
                    className="w-full pl-9 h-10 bg-white/20 border-2 border-white/30 text-white hover:bg-white/30 hover:text-white focus:border-cyan-400 focus:bg-white/30 rounded-xl font-medium text-xs justify-between transition-all duration-300">
                    <MapPin className="absolute left-3 h-3.5 w-3.5 text-white/70" />
                    <span className={city ? "text-white" : "text-white/60"}>{city || "Search your city..."}</span>
                    <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 text-white/70" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-3rem)] max-w-[340px] p-0 bg-background border-border z-50" align="start">
                  <Command className="bg-background">
                    <CommandInput placeholder="Search city..." className="h-10 text-sm" />
                    <CommandList className="max-h-60">
                      <CommandEmpty>No city found.</CommandEmpty>
                      <CommandGroup>
                        {ALL_CITIES.map((cityName) => (
                          <CommandItem key={cityName} value={cityName}
                            onSelect={(currentValue) => { setCity(currentValue === city ? "" : cityName); setCityOpen(false); }}
                            className="text-foreground">
                            <Check className={cn("mr-2 h-4 w-4", city === cityName ? "opacity-100" : "opacity-0")} />
                            {cityName}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Account Type Selection */}
            <div className="space-y-2.5">
              <Label className="text-white font-semibold text-xs">Account Type</Label>
              <div className="grid grid-cols-2 gap-2.5">
                <button type="button" onClick={() => setRole("explorer")}
                  className={cn("relative p-3 rounded-xl border-2 transition-all duration-300 group",
                    role === "explorer" ? "bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-blue-400 shadow-lg shadow-blue-400/30"
                      : "bg-white/10 border-white/30 hover:bg-white/20 hover:border-blue-400/60")}>
                  <div className="flex flex-col items-center space-y-1.5">
                    <div className={cn("p-1.5 rounded-full transition-all duration-300", role === "explorer" ? "bg-blue-400/30" : "bg-white/10 group-hover:bg-blue-400/20")}>
                      <User className={cn("h-3.5 w-3.5 transition-all duration-300", role === "explorer" ? "text-blue-200" : "text-white/80")} />
                    </div>
                    <span className={cn("text-xs font-bold transition-all duration-300", role === "explorer" ? "text-white" : "text-white/80")}>Explorer</span>
                    <span className="text-xs text-white/60 text-center leading-tight">Discover amazing deals</span>
                  </div>
                </button>

                <button type="button" onClick={() => setRole("business")}
                  className={cn("relative p-3 rounded-xl border-2 transition-all duration-300 group",
                    role === "business" ? "bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-400 shadow-lg shadow-green-400/30"
                      : "bg-white/10 border-white/30 hover:bg-white/20 hover:border-green-400/60")}>
                  <div className="flex flex-col items-center space-y-1.5">
                    <div className={cn("p-1.5 rounded-full transition-all duration-300", role === "business" ? "bg-green-400/30" : "bg-white/10 group-hover:bg-green-400/20")}>
                      <Building2 className={cn("h-3.5 w-3.5 transition-all duration-300", role === "business" ? "text-green-200" : "text-white/80")} />
                    </div>
                    <span className={cn("text-xs font-bold transition-all duration-300", role === "business" ? "text-white" : "text-white/80")}>Business</span>
                    <span className="text-xs text-white/60 text-center leading-tight">Grow your business</span>
                  </div>
                </button>
              </div>
            </div>

            <Button type="submit" 
              className="w-full h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white border-0 rounded-xl font-bold text-xs transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed mt-5" 
              disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center space-x-1.5">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <span>Sign Up</span>
              )}
            </Button>

            <div className="text-center pt-2">
              <p className="text-white/90 text-xs">
                Already have an account?{" "}
                <button type="button" onClick={() => navigate("/login")}
                  className="text-yellow-300 font-bold hover:text-yellow-200 transition-all duration-300 underline underline-offset-2">
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
