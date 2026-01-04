
import React from "react";
import TopNavbar from "@/components/TopNavbar";
import BusinessUploadForm from "@/components/business/BusinessUploadForm";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle } from "lucide-react";

const BusinessUpload = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopNavbar 
        title="Add Business" 
        showBackButton={true}
      />
      
      <div className="flex-1 mobile-scroll-container">
        <div className="px-4 py-3 pb-24">
          <div className="max-w-2xl mx-auto bg-card rounded-lg shadow border border-border p-4">
            <h1 className="text-lg font-bold mb-4 text-center text-foreground">List Your Business</h1>
          
            {currentUser ? (
              <BusinessUploadForm />
            ) : (
              <div className="text-center py-10">
                <div className="flex justify-center mb-4">
                  <AlertTriangle className="h-12 w-12 text-amber-500" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Login Required</h2>
                <p className="text-gray-600 mb-4">
                  Please log in to list your business.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessUpload;
