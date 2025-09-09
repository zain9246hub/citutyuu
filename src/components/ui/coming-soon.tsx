import React from "react";
import { cn } from "@/lib/utils";

interface ComingSoonProps {
  className?: string;
  children?: React.ReactNode;
  text?: string;
}

const ComingSoon = ({ 
  className, 
  children, 
  text = "Coming Soon" 
}: ComingSoonProps) => {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg border border-muted/30",
      "bg-muted/5 backdrop-blur-md",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-muted/10 before:to-muted/30 before:backdrop-blur-sm",
      className
    )}>
      <div className="relative z-10 p-6 text-center">
        {children || (
          <div className="space-y-2">
            <div className="text-lg font-medium text-muted-foreground/80">
              {text}
            </div>
            <div className="text-sm text-muted-foreground/60">
              This feature is under development
            </div>
          </div>
        )}
      </div>
      
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-background/40 backdrop-blur-[2px] pointer-events-none" />
    </div>
  );
};

export { ComingSoon };