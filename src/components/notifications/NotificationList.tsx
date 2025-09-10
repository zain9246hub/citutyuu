
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Clock, Tag, TrendingDown, Star, CheckCheck, Trash2, MapPin, Phone, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationList = () => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications, unreadCount } = useNotifications();
  const navigate = useNavigate();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_deal':
        return <Tag className="h-4 w-4 text-green-600" />;
      case 'expiring_deal':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'price_drop':
        return <TrendingDown className="h-4 w-4 text-blue-600" />;
      case 'saved_deal_update':
        return <Star className="h-4 w-4 text-purple-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.dealId) {
      navigate(`/deal/${notification.dealId}`);
    }
  };

  const handleLocationClick = (location: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Open location in maps (Google Maps for web, native maps on mobile)
    const encodedLocation = encodeURIComponent(location);
    const mapsUrl = `https://maps.google.com/maps?q=${encodedLocation}`;
    window.open(mapsUrl, '_blank');
  };

  const handlePhoneClick = (phoneNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Open phone dialer
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="w-full">
      {/* Notification Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-6 w-6 p-0 flex items-center justify-center rounded-full text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="h-8 px-3 text-xs">
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearNotifications} className="h-8 px-2">
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Notification Content */}
      <div className="max-h-96 overflow-y-auto bg-background">
        {notifications.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-medium text-foreground mb-2">No notifications yet</h3>
            <p className="text-sm text-muted-foreground">We'll notify you about new deals and updates</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                  !notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                      )}
                    </div>
                    
                    {/* City location badge */}
                    {notification.city && (
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin className="h-3 w-3 text-orange-600" />
                        <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-orange-50 text-orange-700 border-orange-200">
                          📍 {notification.city}
                        </Badge>
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {notification.message}
                    </p>
                    
                    {/* Action Buttons */}
                    {(notification.shopLocation || notification.phoneNumber) && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {notification.shopLocation && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => handleLocationClick(notification.shopLocation!, e)}
                            className="h-8 px-3 text-xs bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            View Location
                          </Button>
                        )}
                        {notification.phoneNumber && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => handlePhoneClick(notification.phoneNumber!, e)}
                            className="h-8 px-3 text-xs bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            {notification.phoneNumber}
                          </Button>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDistanceToNow(notification.timestamp, { addSuffix: true })}</span>
                      {notification.city && (
                        <span className="text-orange-600 font-medium">
                          From {notification.city}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
