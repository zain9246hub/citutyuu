
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

      <TabsContent value="profile" className="p-4 bg-background rounded-lg border">
        {!isEditing && (
          <div className="space-y-4">
            <div className="rounded-lg p-4 bg-muted/30 border">
              <h3 className="font-semibold mb-3 text-foreground">Account Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-muted-foreground font-medium">Name:</span>
                  <span className="text-foreground font-medium">{currentUser.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-muted-foreground font-medium">Email:</span>
                  <span className="text-foreground font-medium">{currentUser.email}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground font-medium">Account Type:</span>
                  <span className="text-foreground font-medium">{currentUser.role === "business" ? "Business" : "Explorer"}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </TabsContent>

      {currentUser.role === "business" && (
        <>
          <TabsContent value="analytics" className="p-4 bg-background rounded-lg border">
            <BusinessAnalytics businessId={currentUser.id} />
          </TabsContent>
          
          <TabsContent value="manage" className="p-4 bg-background rounded-lg border">
            {renderBusinessManagementContent()}
          </TabsContent>
        </>
      )}

      {currentUser.role === "explorer" && (
        <TabsContent value="saved" className="p-4 bg-background rounded-lg border">
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
              <div className="rounded-lg p-6 text-center py-12 bg-muted/30 border border-dashed">
                <List className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <h3 className="font-semibold mb-2 text-foreground">No Saved Deals Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Save deals and offers to view them here later
                </p>
                <Button size="sm" onClick={() => navigate("/explore")}>Browse Deals</Button>
              </div>
            )}
          </div>
        </TabsContent>
      )}

      <TabsContent value="notifications" className="bg-background">
        <NotificationsTab />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
