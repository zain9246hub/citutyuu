import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Business {
  id: string;
  name: string;
  uploadedBy?: string;
  subscriptionEndDate?: string;
  isActive?: boolean;
  [key: string]: any;
}

export const useBusinessExpiry = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [expiringSoonBusinesses, setExpiringSoonBusinesses] = useState<Business[]>([]);
  const [hasShownNotification, setHasShownNotification] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkExpiry = () => {
      if (!currentUser) return;

      try {
        const userBusinessesString = localStorage.getItem('userBusinesses');
        if (!userBusinessesString) return;

        const businesses: Business[] = JSON.parse(userBusinessesString);
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        // Filter businesses owned by current user that are expiring soon
        const expiringBusinesses = businesses.filter(business => {
          if (!business.subscriptionEndDate) return false;
          
          const endDate = new Date(business.subscriptionEndDate);
          const isExpiringSoon = endDate > now && endDate <= threeDaysFromNow;
          
          // Check ownership
          const uploadedBy = business.uploadedBy?.toLowerCase() || '';
          const keys = [currentUser.name, currentUser.email, currentUser.id]
            .filter(Boolean)
            .map(k => k.toLowerCase());
          const isOwned = keys.some(k => uploadedBy === k || uploadedBy.includes(k) || k.includes(uploadedBy));
          
          return isExpiringSoon && isOwned && business.isActive !== false;
        });

        setExpiringSoonBusinesses(expiringBusinesses);

        // Show notification for businesses expiring soon (only once per business)
        expiringBusinesses.forEach(business => {
          if (!hasShownNotification.has(business.id)) {
            const endDate = new Date(business.subscriptionEndDate!);
            const hoursLeft = Math.floor((endDate.getTime() - Date.now()) / (1000 * 60 * 60));
            const daysLeft = Math.floor(hoursLeft / 24);
            
            toast({
              title: "🏪 Business Listing Expiring Soon!",
              description: `Your business "${business.name}" expires in ${daysLeft > 0 ? `${daysLeft} days` : `${hoursLeft} hours`}. Renew now to keep it visible.`,
              duration: 10000,
            });
            
            setHasShownNotification(prev => new Set(prev).add(business.id));
          }
        });
      } catch (error) {
        console.error('Error checking business expiry:', error);
      }
    };

    // Check immediately and then every hour
    checkExpiry();
    const interval = setInterval(checkExpiry, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentUser, toast, hasShownNotification]);

  return { expiringSoonBusinesses };
};
