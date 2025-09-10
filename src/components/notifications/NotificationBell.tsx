
import React, { useState, memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationList from './NotificationList';
import { Bell } from 'lucide-react';

const NotificationBell = memo(() => {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  console.log('[NotificationBell] Render - unreadCount:', unreadCount);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
  }, []);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-muted/50">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-medium border-2 border-background"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 border shadow-lg" align="end" sideOffset={5}>
        <NotificationList />
      </PopoverContent>
    </Popover>
  );
});

NotificationBell.displayName = 'NotificationBell';

export default NotificationBell;
