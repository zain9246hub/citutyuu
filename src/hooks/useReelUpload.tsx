
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ReelVideo } from "./useReelVideos";

export const useReelUpload = (
  reels: ReelVideo[], 
  setReels: React.Dispatch<React.SetStateAction<ReelVideo[]>>,
  scrollAreaRef: React.RefObject<HTMLDivElement>
) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingReel, setPendingReel] = useState<{ file: File, url: string } | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Check if user is logged in
    if (!currentUser) {
      toast({
        title: "Login required",
        description: "Please log in to upload reels",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is a business user, but allow all users to try
    // We will show a message only after they select a file, to provide better UX
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const url = URL.createObjectURL(file);
    
    // Check if user is a business user after file selection
    if (currentUser.role !== "business") {
      toast({
        title: "Business account required",
        description: "Only business accounts can publish reels. Please upgrade to a business account.",
        variant: "destructive",
      });
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    
    setPendingReel({ file, url });
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const submitReel = (caption: string, directionsUrl?: string, phoneNumber?: string) => {
    if (!pendingReel) return;
    
    // Double check if user is a business user at submission time
    if (!currentUser || currentUser.role !== "business") {
      toast({
        title: "Access denied",
        description: "Only business accounts can upload reels",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newReel: ReelVideo = {
        id: Date.now().toString(),
        url: pendingReel.url,
        user: currentUser ? currentUser.name : "current_user",
        likes: 0,
        caption: caption || "My new reel", // Use provided caption or default
        directionsUrl,
        phoneNumber
      };
      
      setReels([newReel, ...reels]);
      setPendingReel(null);
      setIsUploading(false);
      
      // Scroll to top to show the new reel
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: 0, behavior: 'auto' });
      }
      
      toast({
        title: "Reel uploaded successfully",
        description: "Your new reel is now available",
      });
    }, 1500);
  };
  
  const cancelUpload = () => {
    setPendingReel(null);
  };

  return {
    isUploading,
    pendingReel,
    fileInputRef,
    handleUpload,
    submitReel,
    cancelUpload
  };
};
