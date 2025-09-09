
import { useEffect, useRef } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Deal } from '@/types/deal';
import { 
  NOTIFICATION_STORAGE_KEYS, 
  isAlreadyNotified, 
  addToNotifiedList,
  debounce 
} from '@/utils/notificationUtils';

export const useDealNotifications = (deals: Deal[], savedDeals: number[]) => {
  const { addNotification, settings } = useNotifications();
  const isInitialized = useRef(false);

  // Debounced notification functions to prevent spam
  const debouncedNewDealsCheck = useRef(
    debounce((currentDeals: Deal[]) => {
      if (!settings.newDeals) return;

      const recentDeals = currentDeals.filter(deal => {
        return deal.id > 10 && 
               deal.featured && 
               !isAlreadyNotified(NOTIFICATION_STORAGE_KEYS.NEW_DEALS, deal.id);
      });

      if (recentDeals.length > 0) {
        recentDeals.forEach(deal => {
          addNotification({
            type: 'new_deal',
            title: '🎯 New Deal Available!',
            message: `Check out "${deal.title}" with ${deal.discount}% OFF!`,
            city: deal.city,
            dealId: deal.id,
          });
        });

        addToNotifiedList(
          NOTIFICATION_STORAGE_KEYS.NEW_DEALS, 
          recentDeals.map(d => d.id)
        );
      }
    }, 2000)
  );

  const debouncedExpiringCheck = useRef(
    debounce((currentDeals: Deal[]) => {
      if (!settings.expiringDeals) return;

      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const expiringDeals = currentDeals.filter(deal => {
        if (!deal.expiryDate || isAlreadyNotified(NOTIFICATION_STORAGE_KEYS.EXPIRING_DEALS, deal.id)) {
          return false;
        }
        
        const expiryDate = new Date(deal.expiryDate);
        return expiryDate > now && expiryDate <= tomorrow;
      });

      if (expiringDeals.length > 0) {
        expiringDeals.forEach(deal => {
          addNotification({
            type: 'expiring_deal',
            title: '⏰ Deal Expiring Soon!',
            message: `"${deal.title}" expires in less than 24 hours. Don't miss out!`,
            city: deal.city,
            dealId: deal.id,
          });
        });

        addToNotifiedList(
          NOTIFICATION_STORAGE_KEYS.EXPIRING_DEALS, 
          expiringDeals.map(d => d.id)
        );
      }
    }, 3000)
  );

  const debouncedPriceDropCheck = useRef(
    debounce((currentDeals: Deal[], currentSavedDeals: number[]) => {
      if (!settings.savedDealUpdates || currentSavedDeals.length === 0) return;

      const userSavedDeals = currentDeals.filter(deal => 
        currentSavedDeals.includes(deal.id) &&
        !isAlreadyNotified(NOTIFICATION_STORAGE_KEYS.PRICE_DROPS, deal.id)
      );
      
      const priceDropDeals = userSavedDeals.filter(deal => 
        deal.discountedPrice && deal.originalPrice && deal.discount && deal.discount > 30
      );

      if (priceDropDeals.length > 0) {
        priceDropDeals.forEach(deal => {
          addNotification({
            type: 'price_drop',
            title: '💰 Price Drop Alert!',
            message: `"${deal.title}" now has ${deal.discount}% OFF! Great savings on your saved deal.`,
            city: deal.city,
            dealId: deal.id,
          });
        });

        addToNotifiedList(
          NOTIFICATION_STORAGE_KEYS.PRICE_DROPS, 
          priceDropDeals.map(d => d.id)
        );
      }
    }, 4000)
  );

  // Initialize notifications only once
  useEffect(() => {
    if (isInitialized.current || deals.length === 0) return;
    
    isInitialized.current = true;
    
    // Run initial checks with delays to prevent spam
    const timer1 = setTimeout(() => debouncedNewDealsCheck.current(deals), 1000);
    const timer2 = setTimeout(() => debouncedExpiringCheck.current(deals), 2000);
    const timer3 = setTimeout(() => debouncedPriceDropCheck.current(deals, savedDeals), 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2); 
      clearTimeout(timer3);
    };
  }, [deals.length > 0]); // Only trigger when deals are first loaded

  return null; // This hook doesn't return anything, it just manages side effects
};
