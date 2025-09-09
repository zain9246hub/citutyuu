
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Deal } from "@/types/deal";

interface UseDealCardProps {
  deal: Deal;
  onToggleSave: () => void;
  onShare?: () => void;
}

export const useDealCard = ({ deal, onToggleSave, onShare }: UseDealCardProps) => {
  const { toast } = useToast();
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isShareAnimating, setIsShareAnimating] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareAnimating(true);
    if (onShare) onShare();
    setTimeout(() => setIsShareAnimating(false), 300);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLikeAnimating(true);
    onToggleSave();
    setTimeout(() => setIsLikeAnimating(false), 300);
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deal.phone) {
      window.location.href = `tel:${deal.phone}`;
    }
  };

  const handleAddressClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://maps.google.com?q=${deal.location}, ${deal.city}`, '_blank');
  };

  const copyToClipboard = (e: React.MouseEvent, text: string, message: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: message,
      });
    });
  };

  return {
    isLikeAnimating,
    isShareAnimating,
    handleShare,
    handleLike,
    handlePhoneClick,
    handleAddressClick,
    copyToClipboard,
  };
};
