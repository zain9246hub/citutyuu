
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

// Refactored components
import BusinessHeader from "@/components/business/BusinessHeader";
import BusinessGallery from "@/components/business/BusinessGallery";
import BusinessInfo from "@/components/business/BusinessInfo";
import EnhancedProductsTab from "@/components/business/EnhancedProductsTab";
import EnhancedReviewsTab from "@/components/business/EnhancedReviewsTab";
import ContactTab from "@/components/business/ContactTab";

import { businesses } from "@/data/businessData";

const Business = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("products");

  // Get user-submitted businesses from localStorage
  const getUserBusinesses = () => {
    try {
      return JSON.parse(localStorage.getItem('userBusinesses') || '[]');
    } catch {
      return [];
    }
  };

  // Combine static businesses with user-submitted ones
  const allBusinesses = [...getUserBusinesses(), ...businesses];

  // Find the business by ID, default to first business if no ID or business not found
  const business = allBusinesses.find(b => b.id === id) || allBusinesses[0];

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Business not found</h1>
          <p className="text-muted-foreground mt-2">The business you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate("/businesses")}
            className="mt-4 text-primary hover:underline"
          >
            Go back to businesses
          </button>
        </div>
      </div>
    );
  }
  
  const handleSaveBusiness = () => {
    toast({
      title: "Business Saved",
      description: "Added to your favorites",
    });
  };

  const handleShareBusiness = () => {
    toast({
      title: "Share Options",
      description: "Sharing options will be available soon",
    });
  };

  const handleAddressClick = () => {
    window.open(`https://maps.google.com?q=${encodeURIComponent(business.location)}`, '_blank');
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${business.phone.replace(/\s/g, '')}`;
  };

  return (
    <div className="pb-24">
      {/* Header with back button */}
      <BusinessHeader 
        handleSaveBusiness={handleSaveBusiness}
        handleShareBusiness={handleShareBusiness}
      />

      <div className="pt-16 max-w-md mx-auto">
        {/* Business Images Gallery */}
        <BusinessGallery 
          images={business.images}
          activeImageIndex={activeImageIndex}
          setActiveImageIndex={setActiveImageIndex}
        />

        {/* Business Info */}
        <BusinessInfo 
          business={business}
          handleAddressClick={handleAddressClick}
          handlePhoneClick={handlePhoneClick}
        />

        {/* Tabs for Products, Reviews, Contact */}
        <Tabs defaultValue="products" className="w-full" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="grid grid-cols-3 mx-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* Products Tab Content */}
          <TabsContent value="products" className="px-4">
            <EnhancedProductsTab products={business.products} />
          </TabsContent>

          {/* Reviews Tab Content */}
          <TabsContent value="reviews" className="px-4">
            <EnhancedReviewsTab 
              reviews={business.reviews} 
              overallRating={business.rating}
              totalReviews={business.reviewCount}
            />
          </TabsContent>

          {/* Contact Tab Content */}
          <TabsContent value="contact" className="px-4">
            <ContactTab 
              handlePhoneClick={handlePhoneClick}
              handleAddressClick={handleAddressClick}
              address={`${business.location}, ${business.city}`}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Navbar />
    </div>
  );
};

export default Business;
