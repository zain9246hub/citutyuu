
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface ReelVideo {
  id: string;
  url: string;
  user: string;
  likes: number;
  caption: string;
  directionsUrl?: string;
  phoneNumber?: string;
  isLoading?: boolean;
  isLiked?: boolean;
}

export const useReelVideos = () => {
  const { toast } = useToast();
  const [reels, setReels] = useState<ReelVideo[]>([
    {
      id: "1",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      user: "user_fashionista",
      likes: 1245,
      caption: "Fashion collection 🔥 #fashion #summer",
      directionsUrl: "https://maps.google.com/?q=Fashion+District",
      phoneNumber: "+1 (555) 123-4567",
      isLiked: false,
    },
    {
      id: "2",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      user: "nature_lover",
      likes: 876,
      caption: "Beautiful spring scenery 🌸 #nature #spring",
      directionsUrl: "https://maps.google.com/?q=Botanical+Garden",
      phoneNumber: "+1 (555) 987-6543",
      isLiked: false,
    },
    {
      id: "3",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      user: "ocean_explorer",
      likes: 2340,
      caption: "Amazing ocean views 🌊 #ocean #relax",
      directionsUrl: "https://maps.google.com/?q=Ocean+Beach",
      phoneNumber: "+1 (555) 456-7890",
      isLiked: false,
    }
  ]);

  const handleLike = (reelId: string) => {
    setReels(prevReels => 
      prevReels.map(reel => 
        reel.id === reelId 
          ? { 
              ...reel, 
              likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
              isLiked: !reel.isLiked 
            } 
          : reel
      )
    );
  };

  const handleDirections = (reelId: string) => {
    const reel = reels.find(r => r.id === reelId);
    if (reel?.directionsUrl) {
      window.open(reel.directionsUrl, "_blank");
    } else {
      toast({
        title: "Directions",
        description: "No directions available for this location",
        duration: 2000,
      });
    }
  };

  const handleContact = (reelId: string) => {
    const reel = reels.find(r => r.id === reelId);
    if (reel?.phoneNumber) {
      window.location.href = `tel:${reel.phoneNumber}`;
    } else {
      toast({
        title: "Contact",
        description: "No contact number available",
        duration: 2000,
      });
    }
  };

  const handleShare = async (reelId: string) => {
    const reel = reels.find(r => r.id === reelId);
    if (!reel) return;

    const shareUrl = `${window.location.origin}/reels/${reelId}`;
    const shareData = {
      title: `Check out this reel by ${reel.user}`,
      text: reel.caption,
      url: shareUrl
    };

    try {
      // Try Web Share API first (mobile/modern browsers)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully!",
          description: "Reel has been shared",
          duration: 2000,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "Reel link copied to clipboard",
          duration: 2000,
        });
      }
    } catch (error) {
      // Handle user cancellation or errors
      if (error.name !== 'AbortError') {
        toast({
          title: "Share failed",
          description: "Unable to share reel. Please try again.",
          duration: 2000,
        });
      }
    }
  };

  return {
    reels,
    setReels,
    handleLike,
    handleDirections,
    handleContact,
    handleShare
  };
};
