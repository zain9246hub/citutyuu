
import { useCallback } from 'react';

export const usePriceCalculation = (onDiscountChange?: (discount: number) => void) => {
  const calculateDiscount = useCallback((discount: number) => {
    onDiscountChange?.(discount);
  }, [onDiscountChange]);

  return { calculateDiscount };
};
