
import React, { useEffect, useState, useMemo } from "react";
import ReelVideo from "@/components/ReelVideo";
import useReels from "@/hooks/useReels";
import ReelUploadDialog from "@/components/ReelUploadDialog";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Home, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_CITIES } from "@/utils/cityData";

const Reels = () => {
  const {
    reels,
    currentReelIndex,
    videoRefs,
    scrollAreaRef,
    isUploading,
    pendingReel,
    handleScroll,
    handleLike,
    handleShare,
    handleDirections,
    handleContact,
    submitReel,
    cancelUpload,
  } = useReels();
  
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string>("all");
  
  // Filter reels by city
  const filteredReels = useMemo(() => {
    if (selectedCity === "all") return reels;
    return reels.filter(reel => {
      const reelCity = (reel as any).city;
      return reelCity && reelCity.toLowerCase() === selectedCity.toLowerCase();
    });
  }, [reels, selectedCity]);
  
  // Show initial guidance to users
  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "Welcome to Reels!",
        description: "Tap any video to play or pause. Swipe up/down to navigate.",
        duration: 4000,
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden relative">
      <div className="absolute top-5 left-0 right-0 z-20 flex items-center justify-between px-5">
        <Link to="/">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-black/40 hover:bg-black/60"
          >
            <Home className="h-5 w-5 text-white" />
          </Button>
        </Link>
        
        {/* City Filter */}
        <div className="flex items-center gap-2">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="h-9 w-[140px] bg-black/40 border-none text-white text-xs rounded-full">
              <Filter className="h-3 w-3 mr-1" />
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] z-50 bg-popover">
              <SelectItem value="all">All Cities</SelectItem>
              {ALL_CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div 
        ref={scrollAreaRef}
        className="h-full overflow-y-scroll snap-mandatory snap-y no-scrollbar"
        onScroll={handleScroll}
      >
        {filteredReels.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white text-center px-8">
            <div>
              <p className="text-lg font-semibold mb-2">No reels found</p>
              <p className="text-sm text-white/60">
                {selectedCity !== "all" 
                  ? `No video reels available for ${selectedCity}. Try selecting a different city.`
                  : "No video reels available yet."}
              </p>
            </div>
          </div>
        ) : (
          filteredReels.map((reel, index) => (
            <div 
              key={reel.id} 
              className="h-full w-full snap-start snap-always"
            >
              <ReelVideo
                reel={reel}
                isActive={currentReelIndex === index}
                videoRef={(el) => (videoRefs.current[index] = el)}
                onLike={handleLike}
                onShare={handleShare}
                onDirections={handleDirections}
                onContact={handleContact}
                canOperate={true}
              />
            </div>
          ))
        )}
      </div>
      
      {pendingReel && (
        <ReelUploadDialog
          open={!!pendingReel}
          videoUrl={pendingReel.url}
          isUploading={isUploading}
          onSubmit={submitReel}
          onCancel={cancelUpload}
        />
      )}
      
      <Navbar />
    </div>
  );
};

export default Reels;
