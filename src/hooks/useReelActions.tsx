
import { useToast } from "@/hooks/use-toast";

export const useReelActions = () => {
  const { toast } = useToast();

  const handleShare = (reelId: string) => {
    toast({
      title: "Shared",
      description: "Reel has been shared",
      duration: 2000,
    });
  };

  const handleDirections = (reelId: string, directionsUrl?: string) => {
    if (directionsUrl) {
      window.open(directionsUrl, "_blank");
    } else {
      toast({
        title: "Directions",
        description: "No directions available for this location",
        duration: 2000,
      });
    }
  };

  const handleContact = (reelId: string, phoneNumber?: string) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      toast({
        title: "Contact",
        description: "No contact number available",
        duration: 2000,
      });
    }
  };

  return {
    handleShare,
    handleDirections,
    handleContact
  };
};
