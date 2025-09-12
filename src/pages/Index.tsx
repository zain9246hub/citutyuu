
import React, { useCallback, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import TopNavbar from "../components/TopNavbar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import StateCitySelector from "@/components/home/StateCitySelector";
import DealsSection from "@/components/home/DealsSection";
import { useHomeSearch } from "@/hooks/useHomeSearch";
import { useDeals } from "@/hooks/useDeals";
import { useDealNotifications } from "@/hooks/useDealNotifications";
import { useCityContext } from "@/contexts/CityContext";
import SlotSections from "@/components/home/SlotSections";
import SearchSection from "@/components/home/SearchSection";
import NotificationDemo from "@/components/notifications/NotificationDemo";
import { ComingSoonTag } from "@/components/ui/coming-soon-tag";


const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (!onboardingCompleted && location.pathname !== '/onboarding') {
      navigate('/onboarding');
    }
  }, [navigate]);

  const { toast } = useToast();
  
  // Stable user role checks with better memoization
  const userRoles = useMemo(() => {
    const role = currentUser?.role;
    return {
      isBusinessUser: role === "business",
      isExplorer: role === "explorer"
    };
  }, [currentUser?.role]);
  
  const { selectedCity, setSelectedCity } = useCityContext();
  const {
    searchQuery,
    filterOpen,
    isLoading,
    filterOptions,
    handleSearchChange,
    handleFilterChange,
    handleFilterToggle,
    setFilterOpen
  } = useHomeSearch();
  
  // Stable city filter for deals
  const cityFilterForDeals = useMemo(() => {
    const result = selectedCity === "All Cities" ? null : selectedCity;
    console.log('[Index] City filter calculation:', { selectedCity, result });
    return result;
  }, [selectedCity]);
  
  const { sortedDeals } = useDeals(
    cityFilterForDeals,
    searchQuery,
    filterOptions
  );

  // Get saved deals for notifications
  const savedDealIds = useMemo(() => {
    try {
      const saved = localStorage.getItem('savedDeals');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  // Enable deal notifications
  useDealNotifications(sortedDeals, savedDealIds);

  // Stable callback handlers
  const handleViewAllBanners = useCallback(() => {
    navigate('/all-banners', { 
      state: { 
        isExplorer: userRoles.isExplorer,
        bookedSlotsOnly: userRoles.isExplorer 
      } 
    });
  }, [navigate, userRoles.isExplorer]);

  const handleBookSlot = useCallback((e: React.MouseEvent) => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to book ad slots",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    toast({
      title: "Booking Initiated",
      description: "Redirecting to slot selection",
    });
    navigate('/all-banners');
  }, [currentUser, navigate, toast]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <TopNavbar title="Cityoffers" showBackButton={false} />
      
      <div className="flex-1 w-full pb-20 mx-auto max-w-md md:max-w-2xl lg:max-w-4xl">
        
        <StateCitySelector />
        
        <SlotSections 
          onViewAllBanners={handleViewAllBanners}
          onBookSlot={handleBookSlot}
          isLoading={isLoading}
          selectedCity={cityFilterForDeals}
        />
        
        <SearchSection
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onFilterToggle={handleFilterToggle}
          filterOptions={filterOptions}
          isLoading={isLoading}
          dealCount={sortedDeals?.length}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          onFilterChange={handleFilterChange}
        />
        
        <DealsSection 
          selectedCity={cityFilterForDeals}
          searchQuery={searchQuery}
          filterOptions={filterOptions}
          isLoading={isLoading}
        />
        
        {/* Demo Notification Component */}
        <div className="px-4 mt-6">
          <NotificationDemo />
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default React.memo(Index);
