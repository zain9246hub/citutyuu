import { Trash2, Bell, MapPin, Phone, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  location: string;
  time: string;
  type: "deal" | "alert" | "info";
  actions?: {
    viewLocation?: boolean;
    phoneNumber?: string;
  };
}

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Flash Sale at Pizza Palace!",
      message: "Get 50% off on all pizzas! Valid till midnight. Call now to place your order.",
      location: "Mumbai",
      time: "1 day ago",
      type: "deal",
      actions: {
        viewLocation: true,
        phoneNumber: "+91 98765 43210"
      }
    }
  ]);

  const clearNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
            <Bell className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllNotifications}
          className="text-muted-foreground hover:text-foreground border-border/50 hover:bg-muted/50 transition-all duration-200"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className="group relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/10 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-orange-600" />
            
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/20 rounded-lg flex items-center justify-center">
                    <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200/50 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30 font-medium">
                    <MapPin className="h-3 w-3 mr-1.5" />
                    {notification.location}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearNotification(notification.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <h3 className="font-semibold text-foreground mb-3 text-base leading-tight">
                {notification.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                {notification.message}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">
                  {notification.time} • From {notification.location}
                </span>
                
                {notification.actions && (
                  <div className="flex space-x-3">
                    {notification.actions.viewLocation && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 px-4 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-800/30 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all duration-200"
                      >
                        <MapPin className="h-4 w-4 mr-1.5" />
                        View Location
                      </Button>
                    )}
                    {notification.actions.phoneNumber && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="h-9 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-green-500/25 transition-all duration-200"
                      >
                        <Phone className="h-4 w-4 mr-1.5" />
                        {notification.actions.phoneNumber}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;