
import { useState, useRef, useEffect, useCallback } from "react";
import { ReelVideo } from "./useReelVideos";

export const useReelNavigation = (reels: ReelVideo[]) => {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<number | null>(null);

  // Initialize refs array based on reels length
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, reels.length);
    while (videoRefs.current.length < reels.length) {
      videoRefs.current.push(null);
    }
  }, [reels.length]);

  // Pause all videos except the current one
  const pauseAllVideosExcept = useCallback((activeIndex: number) => {
    videoRefs.current.forEach((video, index) => {
      if (video && index !== activeIndex && !video.paused) {
        video.pause();
      }
    });
  }, []);

  // Handle scroll detection for changing reels
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!scrollAreaRef.current || isScrolling.current) return;
    
    const scrollPosition = scrollAreaRef.current.scrollTop;
    const clientHeight = scrollAreaRef.current.clientHeight;
    
    // Calculate which reel should be visible based on scroll position
    const newIndex = Math.round(scrollPosition / clientHeight);
    const validIndex = Math.max(0, Math.min(newIndex, reels.length - 1));
    
    if (validIndex !== currentReelIndex) {
      pauseAllVideosExcept(validIndex);
      setCurrentReelIndex(validIndex);
    }
  }, [currentReelIndex, reels.length, pauseAllVideosExcept]);

  // Smooth scroll to specific reel
  const scrollToReel = useCallback((index: number) => {
    if (!scrollAreaRef.current || isScrolling.current) return;
    
    isScrolling.current = true;
    const clientHeight = scrollAreaRef.current.clientHeight;
    
    scrollAreaRef.current.scrollTo({
      top: index * clientHeight,
      behavior: 'smooth'
    });
    
    pauseAllVideosExcept(index);
    setCurrentReelIndex(index);
    
    // Clear previous timeout
    if (scrollTimeout.current) {
      window.clearTimeout(scrollTimeout.current);
    }
    
    scrollTimeout.current = window.setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  }, [pauseAllVideosExcept]);

  const handleNextReel = useCallback(() => {
    if (currentReelIndex < reels.length - 1) {
      scrollToReel(currentReelIndex + 1);
    }
  }, [currentReelIndex, reels.length, scrollToReel]);

  const handlePrevReel = useCallback(() => {
    if (currentReelIndex > 0) {
      scrollToReel(currentReelIndex - 1);
    }
  }, [currentReelIndex, scrollToReel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return {
    currentReelIndex,
    videoRefs,
    scrollAreaRef,
    handleScroll,
    handleNextReel,
    handlePrevReel
  };
};
