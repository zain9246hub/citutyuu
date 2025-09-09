
import React, { useEffect, useRef } from "react";

interface VideoPlayerProps {
  url: string;
  isActive: boolean;
  isMuted: boolean;
  videoRef: React.Ref<HTMLVideoElement>;
  onVideoClick: (e: React.MouseEvent<HTMLVideoElement>) => void;
}

const VideoPlayer = ({
  url,
  isActive,
  isMuted,
  videoRef,
  onVideoClick
}: VideoPlayerProps) => {
  const playTimeoutRef = useRef<NodeJS.Timeout>();
  const isPlayingRef = useRef(false);

  // Handle video playback when a reel becomes active
  useEffect(() => {
    const videoElement = videoRef as React.MutableRefObject<HTMLVideoElement>;
    
    // Clear any existing timeout
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
    }

    if (isActive && videoElement?.current) {
      const video = videoElement.current;
      
      // Ensure video is properly configured for mobile
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.preload = 'auto';
      
      const attemptPlay = async () => {
        try {
          // Only attempt to play if not already playing
          if (video.paused && !isPlayingRef.current) {
            isPlayingRef.current = true;
            await video.play();
            console.log("Video playing successfully:", video.src);
          }
        } catch (error) {
          console.error("Video play error:", error);
          isPlayingRef.current = false;
        }
      };

      // Wait for video to be ready before playing
      if (video.readyState >= 2) {
        playTimeoutRef.current = setTimeout(attemptPlay, 100);
      } else {
        const handleLoadedData = () => {
          playTimeoutRef.current = setTimeout(attemptPlay, 100);
          video.removeEventListener('loadeddata', handleLoadedData);
        };
        video.addEventListener('loadeddata', handleLoadedData);
        
        return () => {
          video.removeEventListener('loadeddata', handleLoadedData);
          if (playTimeoutRef.current) {
            clearTimeout(playTimeoutRef.current);
          }
        };
      }
    } else if (!isActive && videoRef) {
      // Pause video when not active
      const videoElement = videoRef as React.MutableRefObject<HTMLVideoElement>;
      if (videoElement?.current && !videoElement.current.paused) {
        videoElement.current.pause();
        isPlayingRef.current = false;
      }
    }

    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, [isActive, videoRef]);

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-[1]"></div>
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-cover"
        loop
        playsInline
        webkit-playsinline="true"
        muted={isMuted}
        controls={false}
        preload="auto"
        onClick={onVideoClick}
        onPlay={() => {
          isPlayingRef.current = true;
        }}
        onPause={() => {
          isPlayingRef.current = false;
        }}
      />
    </div>
  );
};

export default VideoPlayer;
