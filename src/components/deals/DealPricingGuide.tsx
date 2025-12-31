import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, MapPin, Bell, Star, Zap } from "lucide-react";
import { isMetroCity, METRO_PRICING, NON_METRO_PRICING } from "@/utils/metroCities";
import { DealTier } from "@/types/deal";

interface DealPricingGuideProps {
  selectedCity?: string;
  selectedTier?: DealTier;
  onTierSelect?: (tier: DealTier) => void;
}

const DealPricingGuide = ({ selectedCity, selectedTier, onTierSelect }: DealPricingGuideProps) => {
  const isMetro = selectedCity ? isMetroCity(selectedCity) : false;
  const pricing = isMetro ? METRO_PRICING : NON_METRO_PRICING;

  const tiers: {
    id: DealTier;
    name: string;
    price: number;
    icon: typeof MapPin;
    color: string;
    badgeColor: string;
    popular?: boolean;
    features: { text: string; included: boolean }[];
    bestFor: string;
  }[] = [
    {
      id: "standard",
      name: "Standard Deal",
      price: pricing.standard,
      icon: MapPin,
      color: "bg-blue-500",
      badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      features: [
        { text: "Shown in Explore Deals page", included: true },
        { text: "1-2 zip codes targeting", included: true },
        { text: "Local notifications", included: true },
        { text: "Featured on Home Page", included: false },
        { text: "Featured badge", included: false },
      ],
      bestFor: "Local businesses, neighborhood promotions",
    },
    {
      id: "highlight",
      name: "Highlight Deal",
      price: pricing.highlight,
      icon: Star,
      color: "bg-amber-500",
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
      popular: true,
      features: [
        { text: "Shown in Explore Deals page", included: true },
        { text: "4-6 zip codes targeting", included: true },
        { text: "Multi-area notifications", included: true },
        { text: "Featured on Home Page", included: true },
        { text: "Featured badge", included: true },
      ],
      bestFor: "Growing businesses, wider reach",
    },
    {
      id: "citywide",
      name: "City-Wide Push",
      price: pricing.citywide,
      icon: Zap,
      color: "bg-purple-500",
      badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      features: [
        { text: "Shown in Explore Deals page", included: true },
        { text: "Entire city coverage", included: true },
        { text: "City-wide push notifications", included: true },
        { text: "Featured on Home Page", included: true },
        { text: "Premium featured badge", included: true },
      ],
      bestFor: "Large promotions, grand openings",
    },
  ];

  const handleCardClick = (tierId: DealTier) => {
    if (onTierSelect) {
      onTierSelect(tierId);
      // Scroll to form after selection
      setTimeout(() => {
        const formElement = document.getElementById('deal-upload-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Choose Your Deal Tier</h3>
        <Badge variant="outline" className="text-xs">
          {isMetro ? "Metro City Pricing" : "Non-Metro Pricing"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier) => {
          const IconComponent = tier.icon;
          const isSelected = selectedTier === tier.id;
          return (
            <Card 
              key={tier.name}
              onClick={() => handleCardClick(tier.id)}
              className={`relative overflow-hidden border-2 transition-all cursor-pointer hover:shadow-lg hover:scale-[1.02] ${
                isSelected 
                  ? "border-primary ring-2 ring-primary/20 shadow-lg" 
                  : tier.popular 
                    ? "border-amber-500 dark:border-amber-400" 
                    : "border-border hover:border-primary/50"
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl-lg bg-amber-500 text-white hover:bg-amber-500">
                    Popular
                  </Badge>
                </div>
              )}

              {isSelected && (
                <div className="absolute top-2 left-2">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                </div>
              )}
              
              <CardHeader className="pb-2">
                <div className={`w-10 h-10 rounded-lg ${tier.color} flex items-center justify-center mb-2`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-base font-semibold">{tier.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">₹{tier.price}</span>
                  <span className="text-xs text-muted-foreground">all taxes included</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-3">
                <ul className="space-y-2">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={feature.included ? "text-foreground" : "text-muted-foreground/50"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Best for:</span> {tier.bestFor}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
        <Bell className="w-4 h-4 flex-shrink-0" />
        <span>
          <strong>Note:</strong> You can upload up to 5 images per deal. Once uploaded, images cannot be changed.
        </span>
      </div>
    </div>
  );
};

export default DealPricingGuide;
