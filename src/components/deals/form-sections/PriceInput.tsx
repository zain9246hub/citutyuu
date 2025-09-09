
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  max?: string;
  optional?: boolean;
  className?: string;
  "aria-live"?: "off" | "assertive" | "polite"; // Updated to use union type with specific values
}

const PriceInput = ({
  id,
  label,
  value,
  onChange,
  error,
  required,
  max,
  optional,
  className,
  "aria-live": ariaLive
}: PriceInputProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="flex items-center gap-1">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <IndianRupee className="h-4 w-4" />
        </div>
        <Input
          id={id}
          name={id}
          type="number"
          min="0"
          max={max}
          value={value}
          onChange={onChange}
          placeholder="e.g., 499"
          required={required}
          className={cn(
            "pl-9",
            error && "border-red-500 focus-visible:ring-red-500"
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-live={ariaLive}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
      {optional && <p className="text-xs text-gray-500">Optional</p>}
    </div>
  );
};

export default PriceInput;
