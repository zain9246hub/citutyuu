import React from "react";
import TopNavbar from "@/components/TopNavbar";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  /** Page title shown in TopNavbar */
  title?: string;
  /** Whether to show back button in TopNavbar */
  showBack?: boolean;
  /** Additional actions to show in TopNavbar */
  actions?: React.ReactNode;
  /** Whether to show bottom navigation */
  showBottomNav?: boolean;
  /** Custom className for the content container */
  contentClassName?: string;
  /** Whether to use full screen layout (no padding/margins) */
  fullScreen?: boolean;
  /** Whether to hide TopNavbar completely */
  hideTopNavbar?: boolean;
}

/**
 * Standard page layout component with consistent structure
 * - TopNavbar at the top for navigation
 * - Main content area with proper spacing
 * - Bottom Navbar for tab navigation
 */
const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  showBack = false,
  actions,
  showBottomNav = true,
  contentClassName,
  fullScreen = false,
  hideTopNavbar = false,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {!hideTopNavbar && (
        <TopNavbar 
          title={title} 
          showBackButton={showBack} 
          actions={actions} 
        />
      )}
      
      <div 
        className={cn(
          "flex-1",
          !fullScreen && "max-w-md mx-auto w-full",
          showBottomNav && "pb-20",
          contentClassName
        )}
      >
        {children}
      </div>
      
      {showBottomNav && <Navbar />}
    </div>
  );
};

export default PageLayout;