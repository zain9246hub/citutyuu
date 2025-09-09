
export const validatePriceInput = (value: string, originalPrice?: string): string | null => {
  const price = Number(value);
  const original = originalPrice ? Number(originalPrice) : undefined;
  
  if (isNaN(price) || price < 0) {
    return "Please enter a valid price";
  }
  
  if (original && price > original) {
    return "Discounted price cannot be higher than original price";
  }
  
  return null;
};
