
import React, { useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import CityFilter from "@/components/CityFilter";
import SlotCarousel from "@/components/SlotCarousel";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import FilterDialog from "@/components/FilterDialog";
import { useNavigate } from "react-router-dom";
import SlotBookingForm from "@/components/slot/SlotBookingForm";
import { generateMockSlotBanners } from "@/utils/slotUtils";

const AllBanners = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string | null>(() => 
    localStorage.getItem('selectedCity') || null
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ id: string; location: string } | null>(null);
  const [rotationIndices, setRotationIndices] = useState({ 1: 0, 2: 0 });
  const [filterOptions, setFilterOptions] = useState({
    selectedCity: null,
    categories: [] as string[],
    priceRange: null,
    sortBy: "relevance",
    showPopular: false
  });

  // Get banner counts
  const position1Count = generateMockSlotBanners(1, 0).length;
  const position2Count = generateMockSlotBanners(2, 0).length;

  // Allow both explorers and business users to view banners
  if (!currentUser || (currentUser.role !== 'explorer' && currentUser.role !== 'business')) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please log in as an explorer or business to view ad banners</p>
      </div>
    );
  }

  const handleFilterChange = (newFilters: typeof filterOptions) => {
    setFilterOptions(newFilters);
  };

  const handleBookSlot = (slotId: string, location: string) => {
    if (currentUser.role !== 'business') {
      return;
    }
    setSelectedSlot({ id: slotId, location });
    setBookingOpen(true);
  };

  const handleBookingSuccess = () => {
    if (!selectedSlot) return;
    const position = parseInt(selectedSlot.id);
    setRotationIndices(prev => ({
      ...prev,
      [position]: prev[position] + 1
    }));
    setBookingOpen(false);
    setSelectedSlot(null);
  };

  return (
    <div>
      <TopNavbar 
        title="Ad Banners" 
        showBackButton={true} 
        actions={
          <FilterDialog 
            trigger={
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            }
            onFilterChange={handleFilterChange}
            currentFilters={filterOptions}
            open={filterOpen}
            onOpenChange={setFilterOpen}
          />
        } 
      />
      
      <div className="px-4 py-2">
        <CityFilter 
          selectedCity={selectedCity} 
          onSelectCity={(city) => {
            const normalizedCity = city === "All Cities" ? null : city;
            setSelectedCity(normalizedCity);
            localStorage.setItem('selectedCity', normalizedCity || 'All Cities');
          }}
          autoPlay={true}
        />
      </div>
      
      <div className="space-y-6 pb-16">
        <div className="bg-muted/20 py-2 rounded-lg mx-4 mb-2">
          <h2 className="text-lg font-medium px-4">Premium Ad Slots</h2>
          <p className="text-sm text-muted-foreground px-4">
            {position1Count} available slots in position #1
          </p>
        </div>
        <SlotCarousel 
          position={1}
          totalSlots={position1Count}
          showViewAll={false}
          showBookButton={currentUser.role === 'business'}
          onBook={(e) => handleBookSlot("1", "Premium Position")}
          onBookSuccess={handleBookingSuccess}
          paginationEnabled={currentUser.role === 'explorer'}
          itemsPerPage={20}
          autoPlay={currentUser.role === 'explorer'}
          selectedCity={selectedCity}
          maxVisible={currentUser.role === 'business' ? 1 : undefined}
          rotationIndex={rotationIndices[1]}
        />
        
        <div className="bg-muted/20 py-2 rounded-lg mx-4 mb-2 mt-6">
          <h2 className="text-lg font-medium px-4">Standard Ad Slots</h2>
          <p className="text-sm text-muted-foreground px-4">
            {position2Count} available slots in position #2
          </p>
        </div>
        <SlotCarousel 
          position={2}
          totalSlots={position2Count}
          showViewAll={false}
          showBookButton={currentUser.role === 'business'}
          onBook={(e) => handleBookSlot("2", "Standard Position")}
          onBookSuccess={handleBookingSuccess}
          selectedCity={selectedCity}
          maxVisible={currentUser.role === 'business' ? 1 : undefined}
          rotationIndex={rotationIndices[2]}
          autoPlay={currentUser.role === 'explorer'}
        />
        
      </div>

      {selectedSlot && (
        <SlotBookingForm
          open={bookingOpen}
          onClose={() => {
            setBookingOpen(false);
            setSelectedSlot(null);
          }}
          slotId={selectedSlot.id}
          location={selectedSlot.location}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default AllBanners;
