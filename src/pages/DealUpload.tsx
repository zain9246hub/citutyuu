
import React from "react";
import TopNavbar from "@/components/TopNavbar";
import DealUploadForm from "@/components/deals/DealUploadForm";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, Tag, Clock, BadgePercent } from "lucide-react";

const DealUpload = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopNavbar 
        title="Add Deal" 
        showBackButton={true}
      />
      
      <div className="flex-1 mobile-scroll-container">
        <div className="px-4 py-6 pb-24">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center">Create New Deal</h1>
          
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="text-center text-blue-700">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Tag size={16} />
                  <span className="font-medium">Basic Deal</span>
                  <span className="mx-1">-</span>
                  <span>₹120</span>
                </div>
                
                <div className="flex items-center justify-center gap-1 mb-1">
                  <BadgePercent size={16} />
                  <span className="font-medium">Featured Deal</span>
                  <span className="mx-1">-</span>
                  <span>Additional fee applies</span>
                </div>
                
                <div className="flex items-center justify-center gap-1">
                  <Clock size={16} />
                  <span className="font-medium">Duration Options</span>
                  <span className="mx-1">-</span>
                  <span>3, 7, 15, or 30 days</span>
                </div>
              </div>
            </div>
            
            {currentUser?.role === "business" ? (
              <DealUploadForm />
            ) : (
              <div className="text-center py-10">
                <div className="flex justify-center mb-4">
                  <AlertTriangle className="h-12 w-12 text-amber-500" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Business Account Required</h2>
                <p className="text-gray-600 mb-4">
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
