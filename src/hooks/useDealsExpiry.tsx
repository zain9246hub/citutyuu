import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Deal } from '@/types/deal';

export const useDealsExpiry = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [expiringSoonDeals, setExpiringSoonDeals] = useState<Deal[]>([]);
  const [hasShownNotification, setHasShownNotification] = useState<Set<number>>(new Set());

  useEffect(() => {
    const checkExpiry = () => {
      if (!currentUser) return;

      try {
        const userDealsString = localStorage.getItem('userDeals');
        if (!userDealsString) return;

        const deals: Deal[] = JSON.parse(userDealsString);
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        // Filter deals owned by current user that are expiring soon
        const expiringDeals = deals.filter(deal => {
          if (!deal.subscriptionEndDate) return false;
          
          const endDate = new Date(deal.subscriptionEndDate);
          const isExpiringSoon = endDate > now && endDate <= threeDaysFromNow;
          
          // Check ownership
          const uploadedBy = deal.uploadedBy?.toLowerCase() || '';
          const keys = [currentUser.name, currentUser.email, currentUser.id]
            .filter(Boolean)
            .map(k => k.toLowerCase());
          const isOwned = keys.some(k => uploadedBy === k || uploadedBy.includes(k) || k.includes(uploadedBy));
          
          return isExpiringSoon && isOwned && deal.isActive !== false;
        });

        setExpiringSoonDeals(expiringDeals);

        // Show notification for deals expiring soon (only once per deal)
        expiringDeals.forEach(deal => {
          if (!hasShownNotification.has(deal.id)) {
            const endDate = new Date(deal.subscriptionEndDate!);
            const hoursLeft = Math.floor((endDate.getTime() - Date.now()) / (1000 * 60 * 60));
            const daysLeft = Math.floor(hoursLeft / 24);
            
            toast({
              title: "🏷️ Deal Expiring Soon!",
              description: `Your deal "${deal.title}" expires in ${daysLeft > 0 ? `${daysLeft} days` : `${hoursLeft} hours`}. Renew now to keep it live.`,
              duration: 10000,
            });
            
            setHasShownNotification(prev => new Set(prev).add(deal.id));
          }
        });
      } catch (error) {
        console.error('Error checking deal expiry:', error);
      }
    };

    // Check immediately and then every hour
    checkExpiry();
    const interval = setInterval(checkExpiry, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentUser, toast, hasShownNotification]);

  return { expiringSoonDeals };
};
