import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Phone, Globe, ExternalLink } from 'lucide-react';
import GooglePayButton from '@/components/payment/GooglePayButton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useAdvertisements, UploadedAd } from '@/contexts/AdvertisementContext';
import { Deal } from '@/types/deal';
import { useToast } from '@/hooks/use-toast';

interface RenewalPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'banner' | 'deal';
  itemId: string;
}

const RenewalPreviewDialog: React.FC<RenewalPreviewDialogProps> = ({
  open,
  onOpenChange,
  type,
  itemId,
}) => {
  const { uploadedAds, renewAd } = useAdvertisements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const item = useMemo(() => {
    if (type === 'banner') {
      return uploadedAds.find(ad => ad.id === itemId);
    } else {
      const dealsString = localStorage.getItem('userDeals');
      if (!dealsString) return null;
      try {
        const deals: Deal[] = JSON.parse(dealsString);
        return deals.find(deal => deal.id.toString() === itemId);
      } catch {
        return null;
      }
    }
  }, [type, itemId, uploadedAds]);

  if (!item) return null;

  const isBanner = type === 'banner';
  const banner = isBanner ? item as UploadedAd : null;
  const deal = !isBanner ? item as Deal : null;

  const title = isBanner ? banner!.title : deal!.title;
  const description = isBanner ? banner!.description : deal!.description;
  const location = isBanner ? banner!.location : deal!.city;
  const price = isBanner ? banner!.monthlyPrice : deal!.subscriptionPrice || 0;
  const phoneNumber = isBanner ? banner!.phoneNumber : deal!.phone;
  const websiteUrl = isBanner ? banner!.websiteUrl : undefined;
  const locationUrl = isBanner ? banner!.locationUrl : undefined;

  const images = useMemo(() => {
    if (isBanner) {
      return banner!.imageUrls && banner!.imageUrls.length > 0 
        ? banner!.imageUrls 
        : banner!.imageUrl ? [banner!.imageUrl] : [];
    } else {
      // For deals, use images array or fallback to single image
      if (deal!.images && deal!.images.length > 0) {
        return deal!.images;
      }
      return deal!.image ? [deal!.image] : [];
    }
  }, [isBanner, banner, deal]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getNewDates = () => {
    const now = new Date();
    const newEndDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return {
      startDate: formatDate(now.toISOString()),
      endDate: formatDate(newEndDate.toISOString())
    };
  };

  const handleRenewSuccess = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      if (type === 'banner') {
        renewAd(itemId);
      } else {
        // Renew deal
        const dealsString = localStorage.getItem('userDeals');
        if (dealsString) {
          try {
            const deals: Deal[] = JSON.parse(dealsString);
            const updatedDeals = deals.map(d => {
              if (d.id.toString() === itemId) {
                const now = new Date();
                const newEndDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                return {
                  ...d,
                  subscriptionStartDate: now.toISOString(),
                  subscriptionEndDate: newEndDate.toISOString(),
                };
              }
              return d;
            });
            localStorage.setItem('userDeals', JSON.stringify(updatedDeals));
          } catch (error) {
            console.error('Error renewing deal:', error);
          }
        }
      }

      toast({
        title: "Subscription Renewed!",
        description: `Your ${type} subscription has been renewed for 30 days.`,
      });

      setIsProcessing(false);
      onOpenChange(false);
    }, 1000);
  };

  const newDates = getNewDates();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Renew Subscription</DialogTitle>
          <DialogDescription>
            Review and confirm your {type} renewal
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                        <img
                          src={img}
                          alt={`${title} - Image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </>
                )}
              </Carousel>
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  1 / {images.length}
                </div>
              )}
            </div>
          )}

          {/* Details */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {location}
              </p>
            </div>

            <p className="text-sm">{description}</p>

            <Separator />

            {/* Contact Info */}
            <div className="space-y-2">
              {phoneNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${phoneNumber}`} className="text-primary hover:underline">
                    {phoneNumber}
                  </a>
                </div>
              )}
              {websiteUrl && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    Visit Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {locationUrl && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={locationUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    View on Map
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <Separator />

            {/* Subscription Details */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Renewal Period</span>
                <Badge>30 Days</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">New Start Date</p>
                  <p className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3" />
                    {newDates.startDate}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">New End Date</p>
                  <p className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3" />
                    {newDates.endDate}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="font-semibold">Total Amount</span>
                <span className="text-2xl font-bold">₹{price}</span>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-medium">Choose Payment Method</h4>
            
            <GooglePayButton
              amount={price}
              currency="INR"
              onPaymentSuccess={handleRenewSuccess}
              onPaymentError={(error) => {
                console.error('Payment error:', error);
                toast({
                  title: "Payment Failed",
                  description: "Please try again or use another payment method.",
                  variant: "destructive"
                });
              }}
              disabled={isProcessing}
            />

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>

            <Button 
              onClick={handleRenewSuccess} 
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? 'Processing...' : `Pay ₹${price} (Other Methods)`}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Your subscription will be automatically renewed for 30 days from today.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RenewalPreviewDialog;
