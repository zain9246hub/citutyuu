import React, { useState } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bell, MessageCircle, Sparkles, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubscriptionDialog: React.FC<SubscriptionDialogProps> = ({ open, onOpenChange }) => {
  const { hasSubscription, subscribe, selectedCities, addCity, removeCity } = useSubscription();
  const [cityInput, setCityInput] = useState('');
  const [showCityInput, setShowCityInput] = useState(false);

  const handleSubscribe = (type: 'notifications' | 'cityChat' | 'voiceMessages', price: number) => {
    subscribe(type);
    toast({
      title: "Subscribed Successfully!",
      description: `You are now subscribed for ₹${price}/month`,
    });
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-950 via-purple-900 to-indigo-900 border-white/10 p-0">
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
            <p className="text-white/70">Unlock premium features with monthly subscription</p>
          </div>
          
          <div className="space-y-4">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`bg-gradient-to-br ${plan.gradient} border-none shadow-xl overflow-hidden ${
                  plan.popular ? 'ring-2 ring-yellow-400' : ''
                }`}
              >
                <CardContent className="p-6 text-white">
                  {plan.popular && (
                    <div className="mb-4 flex justify-center">
                      <Badge className="bg-yellow-400 text-black text-xs font-bold px-3 py-1">
                        POPULAR
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-white">{plan.title}</h3>
                        <div className="text-3xl font-bold text-white mt-2">
                          ₹{plan.price}
                          <span className="text-sm font-normal text-white/70">/month</span>
                        </div>
                      </div>
                      
                      <ul className="space-y-2 text-sm text-white/90">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <span>{feature}</span>
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
                </CardContent>
              </Card>
            ))}
          </div>

          {(hasSubscription('notifications') || hasSubscription('voiceMessages')) && (
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Selected Cities for Notifications</h3>
                  <Button
                    size="sm"
                    onClick={() => setShowCityInput(!showCityInput)}
                    className="bg-white/20 hover:bg-white/30 text-white"
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
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    />
                    <Button onClick={handleAddCity} size="sm" className="bg-white text-black hover:bg-white/90">
                      Add
                    </Button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {selectedCities.length === 0 ? (
                    <p className="text-white/50 text-sm">No cities selected yet</p>
                  ) : (
                    selectedCities.map((city) => (
                      <Badge
                        key={city}
                        className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 flex items-center gap-2"
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
              </CardContent>
            </Card>
          )}
          
          <p className="text-white/50 text-xs text-center">
            All plans are valid for 1 month and require renewal to continue
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
