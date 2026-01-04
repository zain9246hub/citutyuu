import React, { useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import DealUploadForm from "@/components/deals/DealUploadForm";
import DealPricingGuide from "@/components/deals/DealPricingGuide";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle } from "lucide-react";
import { DealTier } from "@/types/deal";

const DealUpload = () => {
  const { currentUser } = useAuth();
  const [selectedTier, setSelectedTier] = useState<DealTier>("standard");

  const handleTierSelect = (tier: DealTier) => {
    setSelectedTier(tier);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNavbar 
        title="Add Deal" 
        showBackButton={true}
      />
      
      <div className="flex-1 mobile-scroll-container">
        <div className="px-4 py-3 pb-16">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="text-center">
              <h1 className="text-xl font-bold text-foreground">Create New Deal</h1>
              <p className="text-muted-foreground text-sm">Choose a tier and reach your customers</p>
            </div>

            <DealPricingGuide 
              selectedTier={selectedTier}
              onTierSelect={handleTierSelect}
            />

            {currentUser?.role === "business" ? (
              <div id="deal-upload-form" className="bg-card rounded-lg shadow-sm border border-border p-4 sm:p-6">
                <DealUploadForm initialTier={selectedTier} onTierChange={setSelectedTier} />
              </div>
            ) : (
              <div className="bg-card rounded-lg shadow-sm border border-border p-6 text-center">
                <div className="flex justify-center mb-4">
                  <AlertTriangle className="h-12 w-12 text-amber-500" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-foreground">Business Account Required</h2>
                <p className="text-muted-foreground mb-4">
                  You need a business account to create deals. 
                  Please switch to a business account or create a new one.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealUpload;
