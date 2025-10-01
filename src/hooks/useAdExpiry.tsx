import { useEffect, useState } from 'react';
import { useAdvertisements } from '@/contexts/AdvertisementContext';
import { useToast } from '@/hooks/use-toast';
import { UploadedAd } from '@/contexts/AdvertisementContext';

export const useAdExpiry = () => {
  const { getExpiringSoonAds } = useAdvertisements();
  const { toast } = useToast();
  const [expiringSoonAds, setExpiringSoonAds] = useState<UploadedAd[]>([]);
  const [hasShownNotification, setHasShownNotification] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkExpiry = () => {
      const expiringAds = getExpiringSoonAds();
      setExpiringSoonAds(expiringAds);

      // Show notification for ads expiring soon (only once per ad)
      expiringAds.forEach(ad => {
        if (!hasShownNotification.has(ad.id)) {
          const endDate = new Date(ad.subscriptionEndDate);
          const hoursLeft = Math.floor((endDate.getTime() - Date.now()) / (1000 * 60 * 60));
          
          toast({
            title: "Advertisement Expiring Soon!",
            description: `Your ad "${ad.title}" expires in ${hoursLeft} hours. Renew now to keep it live.`,
            duration: 10000,
          });
          
          setHasShownNotification(prev => new Set(prev).add(ad.id));
        }
      });
    };

    // Check immediately and then every hour
    checkExpiry();
    const interval = setInterval(checkExpiry, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [getExpiringSoonAds, toast, hasShownNotification]);

  return { expiringSoonAds };
};
