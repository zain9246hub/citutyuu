import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationBell from './notifications/NotificationBell';
import SmartSearch from './SmartSearch';
interface TopNavbarProps {
  title?: string;
  showBackButton?: boolean;
  actions?: React.ReactNode;
}
const TopNavbar = memo(({
  title = "Cityoffers",
  showBackButton = false,
  actions
}: TopNavbarProps) => {
  const navigate = useNavigate();
  console.log('[TopNavbar] Render - title:', title, 'showBackButton:', showBackButton);
  const handleBack = React.useCallback(() => {
    navigate(-1);
  }, [navigate]);
  return <div className="sticky top-0 z-50 w-full border-b border-transparent bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-size-200 animate-gradient-x">
      <div className="flex items-center justify-between px-4 h-14 glass-navbar">
        <div className="flex items-center gap-3">
          {showBackButton && <Button variant="ghost" size="icon" onClick={handleBack} className="mr-1">
              <ArrowLeft className="h-5 w-5" />
            </Button>}
          {title === "Cityoffers" ? <div className="font-display">
               <h1 className="text-xl md:text-2xl font-semibold tracking-tight bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient-x bg-size-200">
                 City<span className="text-foreground">offers</span>
              </h1>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground -mt-1">​deals and business         </div>
            </div> : <h1 className="text-lg font-medium">{title}</h1>}
        </div>
        
        <div className="flex items-center gap-1">
          <SmartSearch />
          {title === "Cityoffers" && <NotificationBell />}
          {actions}
        </div>
      </div>
    </div>;
});
TopNavbar.displayName = 'TopNavbar';
export default TopNavbar;