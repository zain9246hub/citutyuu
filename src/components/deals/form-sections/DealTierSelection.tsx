import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Sparkles, Video } from 'lucide-react';
import { DealTier } from '@/types/deal';
import { DealPricing } from '@/utils/metroCities';

interface DealTierSelectionProps {
  selectedTier: DealTier;
  onTierChange: (tier: DealTier) => void;
  pricing: DealPricing;
  isMetro: boolean;
}

const DealTierSelection: React.FC<DealTierSelectionProps> = ({
  selectedTier,
  onTierChange,
  pricing,
  isMetro,
}) => {
  const tiers = [
    {
      id: 'standard' as DealTier,
      name: 'Standard Deal',
      price: pricing.standard,
      icon: Check,
      features: [
        'Shows in Explore Deals page',
        'Notifications to 2 zip codes maximum',
        'Up to 5 images',
        'Basic visibility',
      ],
      gradient: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-400/30',
    },
    {
      id: 'highlight' as DealTier,
      name: 'Highlight Deal',
      price: pricing.highlight,
      icon: Star,
      features: [
        'Featured on home page with icon',
        'Shows in Explore Deals page',
        'Notifications to 4-6 zip codes',
        'Up to 5 images',
        'Premium placement',
      ],
      gradient: 'from-purple-500 to-pink-600',
      iconBg: 'bg-purple-400/30',
      popular: true,
    },
    {
      id: 'citywide' as DealTier,
      name: 'City-Wide Push',
      price: pricing.citywide,
      icon: Sparkles,
      features: [
        'Featured on home page',
        'Shows in Explore Deals page',
        'Notifications to ALL users in city',
        'Up to 5 images',
        'Maximum visibility',
      ],
      gradient: 'from-orange-500 to-red-600',
      iconBg: 'bg-orange-400/30',
    },
    {
      id: 'video' as DealTier,
      name: 'Video Reel Deal',
      price: pricing.video,
      icon: Video,
      features: [
        'Upload video as Reel',
        'City-wide push notifications',
        'Shown in Reels section',
        'Entire city coverage',
        'Premium video visibility',
      ],
      gradient: 'from-rose-500 to-pink-600',
      iconBg: 'bg-rose-400/30',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Select Deal Tier</h3>
        <p className="text-sm text-muted-foreground">
          {isMetro ? 'Metro City Pricing' : 'Non-Metro City Pricing'} • All taxes included
        </p>
      </div>

      <RadioGroup 
        value={selectedTier} 
        onValueChange={(value) => onTierChange(value as DealTier)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={`relative cursor-pointer transition-all hover:scale-105 ${
                selectedTier === tier.id
                  ? 'ring-2 ring-primary shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => onTierChange(tier.id)}
            >
              {tier.popular && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500">
                  Popular
                </Badge>
              )}
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <RadioGroupItem value={tier.id} id={tier.id} />
                  <div className="flex-1 space-y-4">
                    <Label
                      htmlFor={tier.id}
                      className="text-base font-semibold cursor-pointer flex items-center gap-2"
                    >
                      <div className={`w-10 h-10 rounded-full ${tier.iconBg} flex items-center justify-center`}>
                        <tier.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div>{tier.name}</div>
                        <div className="text-2xl font-bold text-primary">
                          ₹{tier.price}
                        </div>
                      </div>
                    </Label>

                    <ul className="space-y-2">
                      {tier.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default DealTierSelection;
