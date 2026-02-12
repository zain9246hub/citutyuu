
import React from 'react';
import { Bell, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useListingSubscription } from '@/hooks/useListingSubscription';
import { cn } from '@/lib/utils';

interface SubscribeBellProps {
  listingId: string;
  listingName: string;
  listingType: 'business' | 'restaurant';
  size?: 'sm' | 'md';
  className?: string;
}

const SubscribeBell = ({ listingId, listingName, listingType, size = 'md', className }: SubscribeBellProps) => {
  const { isSubscribed, toggleSubscription } = useListingSubscription();
  const subscribed = isSubscribed(listingId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSubscription(listingId, listingName, listingType);
  };

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={cn(
        "relative transition-all",
        subscribed && "text-primary",
        size === 'sm' && "h-8 w-8",
        className
      )}
      title={subscribed ? `Unsubscribe from ${listingName}` : `Subscribe to ${listingName} for updates`}
    >
      {subscribed ? (
        <BellRing className={cn(iconSize, "text-primary animate-pulse")} />
      ) : (
        <Bell className={iconSize} />
      )}
    </Button>
  );
};

export default SubscribeBell;
