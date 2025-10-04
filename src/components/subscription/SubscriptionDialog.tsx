import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bell, MessageCircle, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubscriptionDialog: React.FC<SubscriptionDialogProps> = ({ open, onOpenChange }) => {
  const { hasSubscription, subscribe } = useSubscription();

  const handleSubscribe = (type: 'notifications' | 'cityChat' | 'voiceMessages', price: number) => {
    subscribe(type);
    toast({
      title: "Subscribed Successfully!",
      description: `You are now subscribed for ₹${price}/month`,
    });
    onOpenChange(false);
  };

  const plans = [
    {
      id: 'notifications' as const,
      title: 'NOTIFICATIONS',
      price: 69,
      icon: Bell,
      features: [
        'Unlimited offers & deals',
        'Multi-city notifications',
        'Search & add cities',
        'Real-time alerts'
      ],
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      id: 'cityChat' as const,
      title: 'CITY CHAT',
      price: 69,
      icon: MessageCircle,
      features: [
        'Unlimited messages',
        'Chat with locals',
        'Community access',
        'No message limits'
      ],
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'voiceMessages' as const,
      title: 'ALL ACCESS',
      price: 119,
      icon: Sparkles,
      features: [
        'Image upload',
        'Voice messages',
        'Multi-city notifications',
        'Everything unlimited'
      ],
      gradient: 'from-orange-500 to-red-600',
      popular: true
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-slate-950 via-purple-900 to-indigo-900 border-white/10 p-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Choose Your Plan</h2>
          <p className="text-white/70 text-center mb-6">Unlock premium features with monthly subscription</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-gradient-to-br ${plan.gradient} rounded-xl p-6 border border-white/10 ${
                  plan.popular ? 'ring-2 ring-yellow-400' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-white">{plan.title}</h3>
                  
                  <div className="text-4xl font-bold text-white">
                    ₹{plan.price}
                    <span className="text-sm font-normal text-white/70">/month</span>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-white/90 w-full">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">✓</span>
                        <span className="text-left">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleSubscribe(plan.id, plan.price)}
                    className={`w-full ${
                      hasSubscription(plan.id)
                        ? 'bg-white/20 hover:bg-white/30'
                        : 'bg-white hover:bg-white/90 text-black'
                    }`}
                    disabled={hasSubscription(plan.id)}
                  >
                    {hasSubscription(plan.id) ? 'ACTIVE ✓' : 'SUBSCRIBE'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-white/50 text-xs text-center mt-6">
            All plans are valid for 1 month and require renewal to continue
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
