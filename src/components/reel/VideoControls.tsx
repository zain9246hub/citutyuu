
import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoControlsProps {
  isMuted: boolean;
  onToggleMute: (e: React.MouseEvent) => void;
}

const VideoControls = ({ isMuted, onToggleMute }: VideoControlsProps) => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="absolute top-20 right-4 rounded-full bg-black/30 backdrop-blur-sm hover:bg-white/20 z-10"
      onClick={onToggleMute}
    >
      {isMuted ? (
        <VolumeX className="h-6 w-6 text-white drop-shadow-md" />
      ) : (
        <Volume2 className="h-6 w-6 text-white drop-shadow-md" />
      )}
    </Button>
  );
};

export default VideoControls;
