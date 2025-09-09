
import React, { useState, useEffect, useRef } from "react";

const VideoBackground = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video sources - we'll add some high-end fashion and food videos
  const videoSources = [
    "https://assets.mixkit.co/videos/preview/mixkit-serving-restaurant-94-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-on-the-catwalk-10825-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-preparing-a-pasta-dish-12872-large.mp4"
  ];
  
  // Randomly select a video source
  const [currentVideoSource] = useState(() => {
    const randomIndex = Math.floor(Math.random() * videoSources.length);
    return videoSources[randomIndex];
  });

  useEffect(() => {
    console.log("VideoBackground mounted");
    
    // Force video reload on mount
    if (videoRef.current) {
      videoRef.current.load();
    }
    
    // Try to play the video
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
          console.log("Video playing successfully");
        } catch (error) {
          console.error("Video play error:", error);
          setVideoError(true);
        }
      }
    };
    
    playVideo();
    
    return () => {
      // Cleanup
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-black/50 z-10" />
      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          onLoadedData={() => {
            console.log("Video loaded successfully");
            setIsVideoLoaded(true);
          }}
          onError={(e) => {
            console.error("Video error:", e);
            setVideoError(true);
          }}
        >
          <source
            src={currentVideoSource}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700" />
      )}
      
      {/* Add a fallback background while video is loading */}
      {!isVideoLoaded && !videoError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700" />
      )}
    </div>
  );
};

export default VideoBackground;
