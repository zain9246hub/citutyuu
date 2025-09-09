import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Deal } from "@/types/deal";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Sparkles, ExternalLink, Share2, Heart, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/ui/star-rating";
import { formatDistanceToNow } from "date-fns";
import { useDeals } from "@/hooks/useDeals";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const DealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAllDeals, toggleSave, isSaved, isFeatured, useDeal, getDealUsageCount } = useDeals();
  const [deal, setDeal] = useState<Deal | null>(null);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const isExplorer = currentUser?.role === 'explorer';
  
  useEffect(() => {
    if (id) {
      const dealId = parseInt(id, 10);
      const allDeals = getAllDeals();
      const foundDeal = allDeals.find(d => d.id === dealId);
      
      if (foundDeal) {
        setDeal(foundDeal);
        useDeal(dealId); // Track deal usage when viewing details
      } else {
        toast({
          title: "Deal not found",
          description: "The requested deal could not be found.",
          variant: "destructive",
        });
        navigate("/explore");
      }
    }
  }, [id, getAllDeals, navigate, toast, useDeal]);

  const handlePhoneClick = (phone: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleAddressClick = (location: string, city: string) => {
    if (location && city) {
      window.open(`https://maps.google.com?q=${location}, ${city}`, '_blank');
    }
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: message,
      });
    });
  };

  const handleShare = () => {
    if (deal) {
      const shareText = `Check out this deal: ${deal.title} at ${deal.location}`;
      navigator.clipboard.writeText(shareText).then(() => {
        toast({
          title: "Deal Shared",
          description: "Deal details copied to clipboard",
        });
      });
    }
  };

  if (!deal) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <p>Loading deal information...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4 sticky top-0 bg-white z-10 flex items-center gap-2 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Deal Details</h1>
      </div>

      <div className="flex-1 pb-20">
        <div className="relative h-64 w-full">
          <img 
            src={deal.image} 
            alt={deal.title}
            className="w-full h-full object-cover"
          />
          {isFeatured(deal.id) && (
            <div className="absolute top-4 left-4 bg-yellow-500 text-white py-1 px-3 rounded-full flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              Featured
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-10 w-10 rounded-full bg-black/30 hover:bg-black/50 ${isSaved(deal.id) ? "text-red-500" : "text-white"}`}
              onClick={() => toggleSave(deal.id)}
            >
              <Heart className="h-5 w-5" fill={isSaved(deal.id) ? "currentColor" : "none"} />
            </Button>
            
            {isExplorer && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-black/30 hover:bg-black/50 text-white"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          <div className="absolute bottom-4 left-4 bg-white/80 text-xs font-bold py-1 px-3 rounded-full">
            {deal.discount}% OFF
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{deal.title}</h2>
            <div className="flex items-center bg-primary/10 text-primary rounded px-2 py-1">
              <StarRating rating={deal.rating} />
            </div>
          </div>

          <div 
            className="flex items-center text-sm text-muted-foreground mt-2 group cursor-pointer border-b border-dashed border-transparent hover:border-blue-300"
            onClick={() => handleAddressClick(deal.location, deal.city)}
          >
            <MapPin className="h-4 w-4 mr-1 text-blue-500" /> 
            <span className="hover:text-blue-500 transition-colors flex items-center">
              {deal.location}, {deal.city}
              <ExternalLink className="h-3 w-3 ml-1 inline text-blue-500" />
            </span>
            <span 
              className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded group-hover:visible invisible"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(`${deal.location}, ${deal.city}`, "Address copied to clipboard");
              }}
            >
              Copy
            </span>
          </div>

          {deal.phone && (
            <div 
              className="flex items-center text-sm text-muted-foreground mt-2 group cursor-pointer border-b border-dashed border-transparent hover:border-blue-300"
              onClick={() => handlePhoneClick(deal.phone)}
            >
              <Phone className="h-4 w-4 mr-1 text-blue-500" /> 
              <span className="hover:text-blue-500 transition-colors flex items-center">
                {deal.phone}
                <ExternalLink className="h-3 w-3 ml-1 inline text-blue-500" />
              </span>
              <span 
                className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded group-hover:visible invisible"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(deal.phone, "Phone number copied to clipboard");
                }}
              >
                Copy
              </span>
            </div>
          )}

          <div className="flex items-center mt-4 gap-2">
            <span className="text-2xl font-bold">₹{deal.discountedPrice}</span>
            <span className="text-lg text-muted-foreground line-through">₹{deal.originalPrice}</span>
          </div>

          {deal.expiryDate && (
            <p className="text-sm text-muted-foreground mt-1">
              Expires {formatDistanceToNow(new Date(deal.expiryDate), { addSuffix: true })}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {deal.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{deal.description}</p>
          </div>

          {!isExplorer && (
            <Button className="w-full mt-6">
              Redeem Deal
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealDetail;
