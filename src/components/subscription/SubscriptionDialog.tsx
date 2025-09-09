import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, ImageIcon, Bell } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubscriptionDialog = ({ open, onOpenChange }: SubscriptionDialogProps) => {
  const { isSubscribed, subscribe, unsubscribe, subscriptionPrice, currency } = useSubscription();

  const handleSubscribe = () => {
    subscribe();
    onOpenChange(false);
  };

  const handleUnsubscribe = () => {
    unsubscribe();
    onOpenChange(false);
  };

  const features = [
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Unlimited Notifications",
      description: "Get instant notifications for all new deals and offers",
      free: "2 per day",
      premium: "Unlimited"
    },
    {
      icon: <ImageIcon className="w-5 h-5" />,
      title: "Image Sharing in Chat",
      description: "Share images in public chat rooms",
      free: "Not available",
      premium: "Available"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Premium Subscription
          </DialogTitle>
          <DialogDescription>
            Unlock premium features and get the most out of your experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-6">
          {/* Pricing */}
          <div className="text-center p-6 border rounded-lg bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-3xl font-bold">₹{subscriptionPrice}</div>
            <div className="text-muted-foreground">per month</div>
            <Badge variant="secondary" className="mt-2">Auto-renewable</Badge>
            <p className="text-sm text-muted-foreground mt-2">Cancel anytime</p>
          </div>

          {/* Features Comparison */}
          <div className="space-y-4">
            <h3 className="font-semibold">What you get:</h3>
            {features.map((feature, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-primary mt-1">{feature.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Free:</span>
                        <div className="font-medium">{feature.free}</div>
                      </div>
                      <div>
                        <span className="text-primary">Premium:</span>
                        <div className="font-medium text-primary flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          {feature.premium}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter className="flex gap-2">
          {isSubscribed ? (
            <Button variant="outline" onClick={handleUnsubscribe} className="flex-1">
              Cancel Subscription
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Maybe Later
              </Button>
              <Button onClick={handleSubscribe} className="flex-1">
                Subscribe Now - ₹{subscriptionPrice}/month
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;