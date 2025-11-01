import React from "react";
import { Card } from "@/components/ui/card";
import { Check, Building2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type BannerTier = "banner-only" | "banner-business";

interface BannerTierSelectionProps {
  selectedTier: BannerTier;
  onTierChange: (tier: BannerTier) => void;
}

const BannerTierSelection: React.FC<BannerTierSelectionProps> = ({
  selectedTier,
  onTierChange,
}) => {
  const tiers = [
    {
      id: "banner-only" as BannerTier,
      name: "Banner Only",
      price: 3538,
      description: "Get your advertisement displayed on premium slots",
      features: [
        "Premium banner placement",
        "30 days visibility",
        "Image upload (up to 5)",
        "Contact information display",
        "Location-based targeting",
      ],
    },
    {
      id: "banner-business" as BannerTier,
      name: "Banner + Discover Business",
      price: 5900,
      description: "Banner placement + Full business listing on platform",
      features: [
        "Everything in Banner Only",
        "Full business profile page",
        "Product/Service showcase",
        "Customer reviews & ratings",
        "Enhanced search visibility",
        "Booking & reservation features",
      ],
      popular: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Choose Your Plan</h3>
        <p className="text-sm text-muted-foreground">
          Select the plan that best fits your business needs
        </p>
      </div>

      <RadioGroup value={selectedTier} onValueChange={(value) => onTierChange(value as BannerTier)}>
        <div className="grid gap-4">
          {tiers.map((tier) => (
            <div key={tier.id} className="relative">
              <RadioGroupItem
                value={tier.id}
                id={tier.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={tier.id}
                className="flex cursor-pointer"
              >
                <Card
                  className={`flex-1 p-4 sm:p-6 transition-all border-2 ${
                    selectedTier === tier.id
                      ? "border-primary shadow-md"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        {tier.id === "banner-business" && (
                          <Building2 className="w-5 h-5 text-primary" />
                        )}
                        <h4 className="font-semibold text-base">{tier.name}</h4>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {tier.description}
                      </p>
                      
                      <div className="space-y-2">
                        {tier.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold">₹{tier.price}</div>
                      <div className="text-xs text-muted-foreground">per month</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        All taxes included
                      </div>
                    </div>
                  </div>
                </Card>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default BannerTierSelection;
