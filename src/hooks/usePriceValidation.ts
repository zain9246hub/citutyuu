
import { useState, useEffect } from "react";
import { validatePriceInput } from "@/utils/priceValidation";

interface UsePriceValidationProps {
  originalPrice: string;
  discountedPrice: string;
  onDiscountChange?: (discount: number) => void;
}

const MIN_DISCOUNT = 5;
const MAX_DISCOUNT = 90;

export const usePriceValidation = ({ 
  originalPrice, 
  discountedPrice, 
  onDiscountChange 
}: UsePriceValidationProps) => {
  const [originalPriceError, setOriginalPriceError] = useState<string | null>(null);
  const [discountedPriceError, setDiscountedPriceError] = useState<string | null>(null);

  useEffect(() => {
    const originalError = validatePriceInput(originalPrice);
    setOriginalPriceError(originalError);
    
    const discountedError = validatePriceInput(discountedPrice, originalPrice);
    const discountValue = Number(originalPrice) > 0 && Number(discountedPrice) > 0
      ? Math.round(((Number(originalPrice) - Number(discountedPrice)) / Number(originalPrice)) * 100)
      : 0;
      
    if (discountValue > MAX_DISCOUNT) {
      setDiscountedPriceError(`Maximum discount allowed is ${MAX_DISCOUNT}%`);
    } else if (discountValue < MIN_DISCOUNT && discountValue !== 0) {
      setDiscountedPriceError(`Minimum discount required is ${MIN_DISCOUNT}%`);
    } else {
      setDiscountedPriceError(discountedError);
    }
    
    if (!originalError && !discountedError && discountValue >= MIN_DISCOUNT && discountValue <= MAX_DISCOUNT) {
      onDiscountChange?.(discountValue);
    }
  }, [originalPrice, discountedPrice, onDiscountChange]);

  return {
    originalPriceError,
    discountedPriceError,
    MIN_DISCOUNT,
    MAX_DISCOUNT
  };
};
