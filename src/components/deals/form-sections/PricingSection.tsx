
import React from "react";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { usePriceValidation } from "@/hooks/usePriceValidation";
import PriceInput from "./PriceInput";
import PricingSectionHeader from "./PricingSectionHeader";

interface PricingSectionProps {
  originalPrice: string;
  discountedPrice: string;
  discount: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDiscountChange?: (discount: number) => void;
}

const PricingSection = ({
  originalPrice,
  discountedPrice,
  discount,
  onInputChange,
  onDiscountChange
}: PricingSectionProps) => {
  const { calculateDiscount } = usePriceCalculation(onDiscountChange);
  const { 
    originalPriceError, 
    discountedPriceError, 
    MIN_DISCOUNT, 
    MAX_DISCOUNT 
  } = usePriceValidation({
    originalPrice,
    discountedPrice,
    onDiscountChange: calculateDiscount
  });

  const handleReset = () => {
    const resetEvent = {
      target: { name: 'originalPrice', value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(resetEvent);
    
    const resetDiscountEvent = {
      target: { name: 'discountedPrice', value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(resetDiscountEvent);
  };

  return (
    <div className="space-y-4">
      <PricingSectionHeader onReset={handleReset} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PriceInput
          id="originalPrice"
          label="Original Price"
          value={originalPrice}
          onChange={onInputChange}
          error={originalPriceError || undefined}
          required
        />
        
        <PriceInput
          id="discountedPrice"
          label={`Discounted Price (${MIN_DISCOUNT}-${MAX_DISCOUNT}% off)`}
          value={discountedPrice}
          onChange={onInputChange}
          error={discountedPriceError || undefined}
          max={originalPrice || undefined}
          optional
        />
        
        <div className="space-y-2">
          <PriceInput
            id="discount"
            label="Discount"
            value={`${discount}`}
            onChange={() => {}}
            required={false}
            aria-live="polite"
            className="bg-gray-50 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500">Auto-calculated</p>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
