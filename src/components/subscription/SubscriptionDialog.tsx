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
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    toast({
      title: "Subscribed Successfully!",
      description: `You are now subscribed for ₹${price}/month. Valid until ${expiryDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border p-0">
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Choose Your Plan</h2>
            <p className="text-muted-foreground">Unlock premium features with monthly subscription</p>
          </div>
          
          <div className="space-y-4">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden border-2 shadow-xl ${
                  plan.popular ? 'border-yellow-400 ring-2 ring-yellow-400/50' : 'border-border'
                }`}
                style={{
                  background: `linear-gradient(135deg, var(--gradient-${plan.id}-start, hsl(270 70% 95%)) 0%, var(--gradient-${plan.id}-end, hsl(280 70% 90%)) 100%)`
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-90 dark:opacity-100`} />
                <CardContent className="relative p-6 text-white">
                  {plan.popular && (
                    <div className="mb-4 flex justify-center">
                      <Badge className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 shadow-lg">
                        POPULAR
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0 shadow-lg">
                      <plan.icon className="w-8 h-8 text-white drop-shadow-md" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-white drop-shadow-md">{plan.title}</h3>
                        <div className="text-3xl font-bold text-white mt-2 drop-shadow-md">
                          ₹{plan.price}
                          <span className="text-sm font-normal text-white/80">/month</span>
                        </div>
                      </div>
                      
                      <ul className="space-y-2 text-sm text-white">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-300 mt-0.5 drop-shadow-md">✓</span>
                            <span className="drop-shadow-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button
                        onClick={() => handleSubscribe(plan.id, plan.price)}
                        className={`w-full font-semibold shadow-lg ${
                          hasSubscription(plan.id)
                            ? 'bg-white/30 hover:bg-white/40 text-white border border-white/30'
                            : 'bg-white hover:bg-white/90 text-gray-900'
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
            <Card className="bg-muted border-border">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Selected Cities for Notifications</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCityInput(!showCityInput)}
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
                      className="bg-background border-border text-foreground"
                    />
                    <Button onClick={handleAddCity} size="sm">
                      Add
                    </Button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {selectedCities.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No cities selected yet</p>
                  ) : (
                    selectedCities.map((city) => (
                      <Badge
                        key={city}
                        variant="secondary"
                        className="px-3 py-1 flex items-center gap-2"
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
          
          <p className="text-muted-foreground text-xs text-center">
            All plans are valid for 1 month and require renewal to continue
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
