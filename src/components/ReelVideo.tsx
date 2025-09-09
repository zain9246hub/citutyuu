
import React, { useState, useCallback } from "react";
import VideoPlayer from "@/components/reel/VideoPlayer";
import VideoControls from "@/components/reel/VideoControls";
import ReelInfo from "@/components/reel/ReelInfo";
import ReelActions from "@/components/reel/ReelActions";

export interface ReelVideoType {
  id: string;
  url: string;
  user: string;
  likes: number;
  caption: string;
  directionsUrl?: string;
  phoneNumber?: string;
  isLiked?: boolean;
}

interface ReelVideoProps {
  reel: ReelVideoType;
  isActive: boolean;
  videoRef: React.Ref<HTMLVideoElement>;
  canOperate?: boolean;
  onLike?: (reelId: string) => void;
  onShare?: (reelId: string) => void;
  onDirections?: (reelId: string) => void;
  onContact?: (reelId: string) => void;
}

const ReelVideo = ({ 
  reel, 
  isActive, 
  videoRef, 
  canOperate = true,
  onLike,
  onShare,
  onDirections,
  onContact
}: ReelVideoProps) => {
  const [isMuted, setIsMuted] = useState(true);
  
  const handleVideoClick = useCallback((e: React.MouseEvent<HTMLVideoElement>) => {
    // Only handle video clicks, not button clicks
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    e.stopPropagation();
    const video = e.currentTarget;
    
    try {
      if (video.paused) {
        // Configure for mobile playback
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Error playing video after click:", error);
          });
        }
      } else {
        video.pause();
      }
    } catch (error) {
      console.error("Exception during click play:", error);
    }
  }, []);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const videoElement = videoRef as React.MutableRefObject<HTMLVideoElement>;
    if (videoElement?.current) {
      const newMutedState = !videoElement.current.muted;
      videoElement.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  }, [videoRef]);

  return (
    <div
      className="h-full w-full snap-start snap-always relative"
      style={{ height: '100vh' }}
    >
      <VideoPlayer 
        url={reel.url}
        isActive={isActive}
        isMuted={isMuted}
        videoRef={videoRef}
        onVideoClick={handleVideoClick}
      />
      
      <VideoControls 
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />
      
      <ReelInfo 
        user={reel.user}
        caption={reel.caption}
      />
      
      <ReelActions 
        reelId={reel.id}
        likes={reel.likes}
        canOperate={canOperate}
        isLiked={reel.isLiked}
        onLike={onLike}
        onShare={onShare}
        onDirections={onDirections}
        onContact={onContact}
        directionsUrl={reel.directionsUrl}
        phoneNumber={reel.phoneNumber}
      />
    </div>
  );
};

export default React.memo(ReelVideo);
