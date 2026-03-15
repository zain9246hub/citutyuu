import { Trash2, Bell, MapPin, Phone, Flame, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const NotificationList = () => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const navigate = useNavigate();

  const handleViewLocation = (shopLocation?: string) => {
    if (shopLocation) {
      const encodedAddress = encodeURIComponent(shopLocation);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  const handleCall = (phoneNumber?: string) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-gradient-to-b from-muted/20 to-muted/5 rounded-2xl border border-border/50">
        <div className="w-16 h-16 bg-gradient-to-br from-muted-foreground/10 to-muted-foreground/5 rounded-2xl flex items-center justify-center mb-4">
          <Bell className="h-8 w-8 text-muted-foreground/70" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-foreground">No notifications yet</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          When you receive notifications, they'll appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between sticky top-0 bg-popover pb-2 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
            <Bell className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          <Badge variant="secondary" className="text-xs">{notifications.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Mark all read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearNotifications}
            className="text-muted-foreground hover:text-foreground border-border/50 hover:bg-muted/50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`group relative overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all duration-200 ${
              !notification.read ? 'bg-primary/5 border-primary/20' : 'bg-background'
            }`}
            onClick={() => {
              markAsRead(notification.id);
              if (notification.type === 'new_deal' || notification.type === 'price_drop' || notification.type === 'expiring_deal') {
                if (notification.dealId) {
                  // Check if it's a video deal - navigate to reels
                  const deals = JSON.parse(localStorage.getItem('uploadedDeals') || '[]');
                  const deal = deals.find((d: any) => d.id === notification.dealId);
                  if (deal?.tier === 'video') {
                    navigate(`/reels?reel=deal-video-${notification.dealId}`);
                  } else {
                    navigate(`/deal/${notification.dealId}`);
                  }
                }
              } else if (notification.type === 'saved_deal_update' && notification.dealId) {
                navigate(`/deal/${notification.dealId}`);
              }
            }}
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${
              notification.type === 'new_deal' ? 'bg-gradient-to-b from-orange-400 to-orange-600' :
              notification.type === 'expiring_deal' ? 'bg-gradient-to-b from-red-400 to-red-600' :
              notification.type === 'price_drop' ? 'bg-gradient-to-b from-green-400 to-green-600' :
              'bg-gradient-to-b from-blue-400 to-blue-600'
            }`} />
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    notification.type === 'new_deal' ? 'bg-orange-100 dark:bg-orange-900/30' :
                    notification.type === 'expiring_deal' ? 'bg-red-100 dark:bg-red-900/30' :
                    notification.type === 'price_drop' ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    <Flame className={`h-4 w-4 ${
                      notification.type === 'new_deal' ? 'text-orange-600 dark:text-orange-400' :
                      notification.type === 'expiring_deal' ? 'text-red-600 dark:text-red-400' :
                      notification.type === 'price_drop' ? 'text-green-600 dark:text-green-400' :
                      'text-blue-600 dark:text-blue-400'
                    }`} />
                  </div>
                  {notification.city && (
                    <Badge variant="secondary" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {notification.city}
                    </Badge>
                  )}
                  {!notification.read && (
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                </span>
              </div>

              <h3 className="font-semibold text-foreground mb-1 text-sm leading-tight">
                {notification.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {notification.message}
              </p>

              {(notification.shopLocation || notification.phoneNumber) && (
                <div className="flex flex-wrap gap-2">
                  {notification.shopLocation && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewLocation(notification.shopLocation);
                      }}
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      Location
                    </Button>
                  )}
                  {notification.phoneNumber && (
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCall(notification.phoneNumber);
                      }}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;