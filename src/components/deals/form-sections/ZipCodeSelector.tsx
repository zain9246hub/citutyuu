import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DealTier } from '@/types/deal';
import { ZIP_CODE_LIMITS } from '@/utils/metroCities';

interface ZipCodeSelectorProps {
  tier: DealTier;
  zipCodes: string[];
  onZipCodesChange: (zipCodes: string[]) => void;
}

const ZipCodeSelector: React.FC<ZipCodeSelectorProps> = ({
  tier,
  zipCodes,
  onZipCodesChange,
}) => {
  const [inputValue, setInputValue] = useState('');
  const limits = ZIP_CODE_LIMITS[tier];

  // City-wide doesn't need zip codes
  if (tier === 'citywide') {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          City-Wide Push notifications are sent to all users in the selected city. No zip code targeting needed.
        </AlertDescription>
      </Alert>
    );
  }

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // Basic validation for Indian pin codes (6 digits)
    if (!/^\d{6}$/.test(trimmed)) {
      return;
    }

    if (zipCodes.includes(trimmed)) {
      return;
    }

    if (zipCodes.length >= limits.max) {
      return;
    }

    onZipCodesChange([...zipCodes, trimmed]);
    setInputValue('');
  };

  const handleRemove = (zipCode: string) => {
    onZipCodesChange(zipCodes.filter((z) => z !== zipCode));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const canAddMore = zipCodes.length < limits.max;
  const needsMore = zipCodes.length < limits.min;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="zipcode">Target Zip Codes (PIN Codes)</Label>
        <p className="text-sm text-muted-foreground mt-1">
          {tier === 'standard' 
            ? 'Add up to 2 zip codes for notification targeting'
            : 'Add 4-6 zip codes for notification targeting (minimum 4 required)'}
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          id="zipcode"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter 6-digit PIN code"
          maxLength={6}
          disabled={!canAddMore}
        />
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!canAddMore || !inputValue.trim()}
          size="icon"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {zipCodes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {zipCodes.map((zipCode) => (
            <Badge key={zipCode} variant="secondary" className="px-3 py-1">
              {zipCode}
              <X
                className="w-3 h-3 ml-2 cursor-pointer"
                onClick={() => handleRemove(zipCode)}
              />
            </Badge>
          ))}
        </div>
      )}

      <Alert variant={needsMore ? 'destructive' : 'default'}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {needsMore ? (
            <>Required: {limits.min - zipCodes.length} more zip code{limits.min - zipCodes.length > 1 ? 's' : ''}</>
          ) : (
            <>Added: {zipCodes.length} / {limits.max} zip codes</>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ZipCodeSelector;
