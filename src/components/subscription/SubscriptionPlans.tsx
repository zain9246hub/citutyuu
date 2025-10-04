import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, MessageCircle, Mic } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SubscriptionPlans: React.FC = () => {
  const { hasSubscription, subscribe, unsubscribe } = useSubscription();

  const handleSubscribe = (type: 'notifications' | 'cityChat' | 'voiceMessages', price: number) => {
    if (hasSubscription(type)) {
      unsubscribe(type);
      toast({
        title: "Unsubscribed",
        description: `You have cancelled your subscription.`,
      });
    } else {
      subscribe(type);
      toast({
        title: "Subscribed Successfully!",
        description: `You are now subscribed for ₹${price}/month`,
      });
    }
  };

  const plans = [
    {
      id: 'notifications' as const,
      title: 'NOTIFICATIONS',
      price: 69,
      icon: Bell,
      description: 'Get unlimited offers & deals notification for one month',
      gradient: 'from-pink-500 to-rose-600',
      iconBg: 'bg-pink-400/30'
    },
    {
      id: 'cityChat' as const,
      title: 'CITY CHAT',
      price: 69,
      icon: MessageCircle,
      description: 'Get gossip with locals and get your requirement fulfilled at same time',
      gradient: 'from-orange-500 to-red-600',
      iconBg: 'bg-purple-500/30'
    },
    {
      id: 'voiceMessages' as const,
      title: 'SAVE up to\nTHOUSANDS\nof RUPEES',
      price: 119,
      icon: Mic,
      description: 'Get unlimited voice message unlocked promote your products',
      gradient: 'from-purple-600 to-indigo-700',
      iconBg: 'bg-purple-400/30',
      highlight: 'THOUSANDS'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6 pt-8">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`bg-gradient-to-br ${plan.gradient} border-none shadow-2xl overflow-hidden transform transition-all hover:scale-[1.02]`}
          >
            <CardContent className="p-8 text-white">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon */}
                <div className={`w-24 h-24 rounded-full ${plan.iconBg} flex items-center justify-center backdrop-blur-sm`}>
                  <plan.icon className="w-12 h-12" />
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold tracking-wider whitespace-pre-line">
                  {plan.highlight ? (
                    plan.title.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line.includes(plan.highlight) ? (
                          <span className="text-yellow-300">{line}</span>
                        ) : (
                          line
                        )}
                        {i < plan.title.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))
                  ) : (
                    plan.title
                  )}
                </h2>

                {/* Price */}
                <div className="text-6xl font-bold">
                  ₹{plan.price}<span className="text-2xl">/month</span>
                </div>

                {/* Description */}
                <p className="text-lg opacity-90 max-w-md leading-relaxed">
                  {plan.description}
                </p>
                
                <p className="text-sm opacity-75 italic">
                  Valid for 1 month • Renew to continue
                </p>

                {/* Button */}
                <Button
                  onClick={() => handleSubscribe(plan.id, plan.price)}
                  size="lg"
                  className={`w-full max-w-xs text-xl font-bold py-6 rounded-full ${
                    hasSubscription(plan.id)
                      ? 'bg-white/20 hover:bg-white/30 border-2 border-white/50'
                      : 'bg-white/90 hover:bg-white text-pink-600 hover:text-pink-700'
                  } transition-all shadow-xl`}
                >
                  {hasSubscription(plan.id) ? 'SUBSCRIBED ✓' : 'UPGRADE'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
