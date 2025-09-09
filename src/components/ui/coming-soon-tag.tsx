import React from "react";
import { cn } from "@/lib/utils";

interface ComingSoonTagProps {
  className?: string;
  text?: string;
  variant?: "default" | "compact" | "pulse";
}

const ComingSoonTag = ({ 
  className, 
  text = "Coming Soon",
  variant = "default"
}: ComingSoonTagProps) => {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5",
      "text-orange-600 font-medium",
      {
        "text-xs": variant === "default",
        "text-[10px]": variant === "compact", 
        "text-xs animate-bounce": variant === "pulse"
      },
      className
    )}>
      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-[blink_0.8s_ease-in-out_infinite]" />
      {text}
    </span>
  );
};

export { ComingSoonTag };