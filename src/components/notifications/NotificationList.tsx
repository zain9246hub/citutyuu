
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 px-2 text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearNotifications}>
                <Trash2 className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notifications yet</p>
            <p className="text-sm">We'll notify you about new deals and updates</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-medium ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    
                    {/* City location badge - prominently displayed */}
                    {notification.city && (
                      <div className="flex items-center gap-1 mt-1 mb-2">
                        <MapPin className="h-3 w-3 text-orange-600" />
                        <Badge variant="outline" className="text-xs px-2 py-1 bg-orange-50 text-orange-700 border-orange-200">
                          📍 {notification.city}
                        </Badge>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    
                    {/* Shop Location and Phone Number - Clickable */}
                    {(notification.shopLocation || notification.phoneNumber) && (
                      <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-gray-100">
                        {notification.shopLocation && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => handleLocationClick(notification.shopLocation!, e)}
                            className="h-7 px-2 text-xs bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            View Location
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                        {notification.phoneNumber && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => handlePhoneClick(notification.phoneNumber!, e)}
                            className="h-7 px-2 text-xs bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            {notification.phoneNumber}
                          </Button>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                      {notification.city && (
                        <span className="text-xs text-orange-600 font-medium">
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
      </CardContent>
    </Card>
  );
};

export default NotificationList;
