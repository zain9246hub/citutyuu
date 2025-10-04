import React, { useState } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, MessageCircle, Sparkles, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const SubscriptionPlans: React.FC = () => {
  const { hasSubscription, subscribe, unsubscribe, selectedCities, addCity, removeCity, monthlyMessagesUsed, maxMonthlyMessages } = useSubscription();
  const [cityInput, setCityInput] = useState('');
  const [showCityInput, setShowCityInput] = useState(false);

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

  const handleAddCity = () => {
    if (cityInput.trim()) {
      addCity(cityInput.trim());
      setCityInput('');
      toast({
        title: "City Added",
        description: `You will now receive notifications for ${cityInput.trim()}`,
      });
    }
  };

  const plans = [
    {
      id: 'notifications' as const,
      title: 'NOTIFICATIONS',
      price: 69,
      icon: Bell,
      description: 'Unlimited offers & deals notifications for selected cities',
      gradient: 'from-pink-500 to-rose-600',
      iconBg: 'bg-pink-400/30'
    },
    {
      id: 'cityChat' as const,
      title: 'CITY CHAT',
      price: 69,
      icon: MessageCircle,
      description: `Free: ${maxMonthlyMessages} messages/month • Unlimited: ∞ messages`,
      gradient: 'from-purple-500 to-indigo-600',
      iconBg: 'bg-purple-500/30'
    },
    {
      id: 'voiceMessages' as const,
      title: 'ALL ACCESS',
      price: 119,
      icon: Sparkles,
      description: 'Images, voice messages, multi-city notifications & unlimited chat',
      gradient: 'from-orange-500 to-red-600',
      iconBg: 'bg-orange-400/30',
      highlight: true
    }
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground">All plans valid for 1 month • Renew to continue</p>
        {!hasSubscription('cityChat') && !hasSubscription('voiceMessages') && (
          <p className="text-sm text-orange-600">
            Free: {monthlyMessagesUsed}/{maxMonthlyMessages} messages used this month
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`bg-gradient-to-br ${plan.gradient} border-none shadow-xl overflow-hidden ${
              plan.highlight ? 'ring-2 ring-yellow-400' : ''
            }`}
          >
            <CardContent className="p-6 text-white">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-full ${plan.iconBg} flex items-center justify-center backdrop-blur-sm`}>
                  <plan.icon className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-bold">{plan.title}</h3>

                <div className="text-4xl font-bold">
                  ₹{plan.price}
                  <span className="text-sm font-normal">/month</span>
                </div>

                <p className="text-sm opacity-90 min-h-[40px]">
                  {plan.description}
                </p>

                <Button
                  onClick={() => handleSubscribe(plan.id, plan.price)}
                  size="lg"
                  className={`w-full ${
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

      {(hasSubscription('notifications') || hasSubscription('voiceMessages')) && (
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-white/10">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Selected Cities for Notifications</h3>
                <Button
                  size="sm"
                  onClick={() => setShowCityInput(!showCityInput)}
                  className="bg-white/10 hover:bg-white/20"
                >
                  Add City
                </Button>
              </div>

              {showCityInput && (
                <div className="flex gap-2">
                  <Input
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCity()}
                    placeholder="Enter city name..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button onClick={handleAddCity} size="sm">Add</Button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {selectedCities.length === 0 ? (
                  <p className="text-white/50 text-sm">No cities selected yet</p>
                ) : (
                  selectedCities.map((city) => (
                    <Badge
                      key={city}
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 flex items-center gap-2"
                    >
                      {city}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeCity(city)}
                      />
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionPlans;
