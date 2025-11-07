
import React, { useEffect } from "react";
import ReelVideo from "@/components/ReelVideo";
import ReelsHeader from "@/components/ReelsHeader";
import useReels from "@/hooks/useReels";
import ReelUploadDialog from "@/components/ReelUploadDialog";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Reels = () => {
  const {
    reels,
    currentReelIndex,
    videoRefs,
    scrollAreaRef,
    isUploading,
    pendingReel,
    fileInputRef,
    handleScroll,
    handleLike,
    handleShare,
    handleDirections,
    handleContact,
    handleUpload,
    submitReel,
    cancelUpload,
  } = useReels();
  
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
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
      <div className="absolute top-5 right-5 z-20 pointer-events-none flex items-center justify-between w-full px-5">
        <Link to="/" className="pointer-events-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-black/40 hover:bg-black/60"
          >
            <Home className="h-5 w-5 text-white" />
          </Button>
        </Link>
        <ReelsHeader
          onUpload={handleUpload}
          fileInputRef={fileInputRef}
          isUploading={isUploading}
          showUploadButton={true}
        />
      </div>
      
      <div 
        ref={scrollAreaRef}
        className="h-full overflow-y-scroll snap-mandatory snap-y no-scrollbar"
        onScroll={handleScroll}
      >
        {reels.map((reel, index) => (
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
        ))}
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
