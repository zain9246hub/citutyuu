import React from 'react';
import { cn } from '@/lib/utils';

interface NativeAppLayoutProps {
  children: React.ReactNode;
  className?: string;
  withNavbar?: boolean;
}

/**
 * Native-optimized layout wrapper for mobile app experience
 * Handles safe areas, proper scrolling, and native app styling
 */
const NativeAppLayout: React.FC<NativeAppLayoutProps> = ({ 
  children, 
  className,
  withNavbar = true 
}) => {
  return (
    <div className={cn(
      "min-h-screen-safe flex flex-col",
      "native-scroll no-tap-highlight",
      className
    )}>
      <main className={cn(
        "flex-1 flex flex-col",
        withNavbar && "pb-20" // Space for bottom navbar
      )}>
        {children}
      </main>
    </div>
  );
};

export default NativeAppLayout;
