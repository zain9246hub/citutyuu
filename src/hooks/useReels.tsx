
import { useReelVideos, type ReelVideo } from "./useReelVideos";
import { useReelNavigation } from "./useReelNavigation";
import { useReelUpload } from "./useReelUpload";
import { useReelActions } from "./useReelActions";

export { type ReelVideo };

export const useReels = () => {
  // Get reels data and operations
  const { reels, setReels, handleLike, handleDirections, handleContact, handleShare } = useReelVideos();
  
  // Get navigation controls
  const {
    currentReelIndex,
    videoRefs,
    scrollAreaRef,
    handleScroll,
    handleNextReel,
    handlePrevReel
  } = useReelNavigation(reels);
  
  // Get upload functionality
  const {
    isUploading,
    pendingReel,
    fileInputRef,
    handleUpload,
    submitReel,
    cancelUpload
  } = useReelUpload(reels, setReels, scrollAreaRef);

  return {
    // Video data
    reels,
    currentReelIndex,
    
    // Video player refs
    videoRefs,
    scrollAreaRef,
    
    // Upload state
    isUploading,
    pendingReel,
    fileInputRef,
    
    // Event handlers
    handleScroll,
    handleNextReel,
    handlePrevReel,
    handleLike,
    handleShare,
    handleDirections,
    handleContact,
    handleUpload,
    submitReel,
    cancelUpload
  };
};

export default useReels;
