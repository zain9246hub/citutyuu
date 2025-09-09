
import { User } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessAnalytics from "@/components/analytics/BusinessAnalytics";
import DealCard from "@/components/DealCard";
import NotificationsTab from "@/components/profile/NotificationsTab";
import { Deal } from "@/types/deal";
import { List, PlusCircle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDeals } from "@/hooks/useDeals";

interface ProfileTabsProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (value: string) => void;
  isEditing: boolean;
}

const ProfileTabs = ({ currentUser, activeTab, setActiveTab, isEditing }: ProfileTabsProps) => {
  const navigate = useNavigate();
  const { getAllDeals, toggleSave, isSaved, sortedDeals } = useDeals();
  const savedDeals = sortedDeals.filter(deal => isSaved(deal.id));

  const handleDealClick = (dealId: number) => {
    navigate(`/deal/${dealId}`);
  };

  const handleShare = (dealId: number) => {
    const allDeals = getAllDeals();
    const deal = allDeals.find(d => d.id === dealId);
    if (deal) {
      const shareText = `Check out this amazing deal: ${deal.title} at ${deal.location}. Discount: ${deal.discount}% OFF`;
      navigator.clipboard.writeText(shareText);
    }
  };

  const renderBusinessManagementContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <Button
          variant="outline"
          className="flex items-center justify-between p-4 h-auto border-dashed"
          onClick={() => navigate("/business-upload")}
        >
          <div className="flex flex-col items-start">
            <h3 className="font-medium">Add New Business</h3>
            <p className="text-xs text-gray-500 text-left">Upload and manage your business listings</p>
          </div>
          <Store className="h-5 w-5 text-blue-500" />
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-between p-4 h-auto border-dashed"
          onClick={() => navigate("/all-banners")}
        >
          <div className="flex flex-col items-start">
            <h3 className="font-medium">Manage Ad Slots</h3>
            <p className="text-xs text-gray-500 text-left">Book ad slots for your business</p>
          </div>
          <PlusCircle className="h-5 w-5 text-blue-500" />
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-between p-4 h-auto border-dashed"
          onClick={() => navigate("/reels")}
        >
          <div className="flex flex-col items-start">
            <h3 className="font-medium">Create Reels</h3>
            <p className="text-xs text-gray-500 text-left">Upload and share video content</p>
          </div>
          <PlusCircle className="h-5 w-5 text-blue-500" />
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-between p-4 h-auto border-dashed"
          onClick={() => navigate("/deal-upload")}
        >
          <div className="flex flex-col items-start">
            <h3 className="font-medium">Add Deals</h3>
            <p className="text-xs text-gray-500 text-left">Create new special offers for customers</p>
          </div>
          <PlusCircle className="h-5 w-5 text-blue-500" />
        </Button>
      </div>
    </div>
  );

  return (
    <Tabs 
      defaultValue="profile" 
      className="w-full" 
      value={activeTab} 
      onValueChange={setActiveTab}
    >
      <TabsList 
        className="grid w-full" 
        style={{ 
          gridTemplateColumns: currentUser.role === "business" ? "repeat(4, 1fr)" : "repeat(3, 1fr)" 
        }}
      >
        <TabsTrigger value="profile">Profile</TabsTrigger>
        {currentUser.role === "business" && (
          <>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </>
        )}
        {currentUser.role === "explorer" && (
          <TabsTrigger value="saved">Saved</TabsTrigger>
        )}
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="p-4 bg-white rounded-b-lg shadow-sm">
        {!isEditing && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Account Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name:</span>
                  <span>{currentUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span>{currentUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Type:</span>
                  <span>{currentUser.role === "business" ? "Business" : "Explorer"}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </TabsContent>

      {currentUser.role === "business" && (
        <>
          <TabsContent value="analytics" className="p-4 bg-white rounded-b-lg shadow-sm">
            <BusinessAnalytics businessId={currentUser.id} />
          </TabsContent>
          
          <TabsContent value="manage" className="p-4 bg-white rounded-b-lg shadow-sm">
            {renderBusinessManagementContent()}
          </TabsContent>
        </>
      )}

      {currentUser.role === "explorer" && (
        <TabsContent value="saved" className="p-4 bg-white rounded-b-lg shadow-sm">
          <div className="space-y-4">
            {savedDeals.length > 0 ? (
              savedDeals.map(deal => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  saved={true}
                  featured={deal.featured}
                  onToggleSave={() => toggleSave(deal.id)}
                  onShare={() => handleShare(deal.id)}
                  onClick={() => handleDealClick(deal.id)}
                />
              ))
            ) : (
              <div className="border rounded-lg p-4 text-center py-8">
                <List className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <h3 className="font-medium mb-1">No Saved Deals Yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Save deals and offers to view them here later
                </p>
                <Button size="sm" onClick={() => navigate("/explore")}>Browse Deals</Button>
              </div>
            )}
          </div>
        </TabsContent>
      )}

      <TabsContent value="notifications" className="p-4 bg-white rounded-b-lg shadow-sm">
        <NotificationsTab />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
