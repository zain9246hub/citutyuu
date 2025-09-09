import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Bell, ImageIcon, Settings } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import SubscriptionDialog from "./SubscriptionDialog";

const SubscriptionStatus = () => {
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const { 
    isSubscribed, 
    dailyNotificationsUsed, 
    maxDailyNotifications, 
    canReceiveNotification,
    canShareImages,
    subscriptionPrice 
  } = useSubscription();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {isSubscribed ? (
            <>
              <Crown className="w-5 h-5 text-primary" />
              Premium Subscriber
            </>
          ) : (
            <>
              <Settings className="w-5 h-5" />
              Free Plan
            </>
          )}
          <Badge variant={isSubscribed ? "default" : "secondary"} className="ml-auto">
            {isSubscribed ? "Active" : "Free"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Notification Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="text-sm font-medium">Daily Notifications</span>
          </div>
          <div className="text-right">
            {isSubscribed ? (
              <Badge variant="default">Unlimited</Badge>
            ) : (
              <span className="text-sm text-muted-foreground">
                {dailyNotificationsUsed} / {maxDailyNotifications} used
              </span>
            )}
          </div>
        </div>

        {/* Image Sharing Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Image Sharing</span>
          </div>
          <div className="text-right">
            {canShareImages ? (
              <Badge variant="default">Available</Badge>
            ) : (
              <Badge variant="secondary">Premium Only</Badge>
            )}
          </div>
        </div>

        {/* Subscription Action */}
        <div className="pt-2">
          {isSubscribed ? (
            <div className="text-center text-sm text-muted-foreground">
              <p>Enjoying premium features!</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSubscriptionDialog(true)}
                className="mt-2"
              >
                Manage Subscription
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Upgrade for unlimited notifications and image sharing
              </p>
              <Button 
                onClick={() => setShowSubscriptionDialog(true)}
                className="w-full"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium - ₹{subscriptionPrice}/month
              </Button>
            </div>
          )}
        </div>

        {/* Usage Warning for Free Users */}
        {!isSubscribed && !canReceiveNotification && (
          <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 dark:bg-orange-950 dark:border-orange-800">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              You've reached your daily notification limit. Subscribe to get unlimited notifications!
            </p>
          </div>
        )}
      </CardContent>

      <SubscriptionDialog 
        open={showSubscriptionDialog} 
        onOpenChange={setShowSubscriptionDialog} 
      />
    </Card>
  );
};

export default SubscriptionStatus;