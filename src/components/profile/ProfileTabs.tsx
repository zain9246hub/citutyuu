
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
    <div className="space-y-6 p-1">
      <div className="grid grid-cols-1 gap-5">
        <div
          className="group relative bg-gradient-to-br from-blue-50 via-white to-blue-50/50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/10 border border-blue-200/60 dark:border-blue-800/30 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => navigate("/business-upload")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center justify-between">
            <div className="flex flex-col items-start space-y-2">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                Add New Business
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Upload and manage your business listings
              </p>
            </div>
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
              <Store className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div
          className="group relative bg-gradient-to-br from-purple-50 via-white to-purple-50/50 dark:from-purple-950/20 dark:via-background dark:to-purple-950/10 border border-purple-200/60 dark:border-purple-800/30 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => navigate("/all-banners")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center justify-between">
            <div className="flex flex-col items-start space-y-2">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-200">
                Manage Ad Slots
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Book ad slots for your business
              </p>
            </div>
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-110">
              <PlusCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div
          className="group relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/10 border border-emerald-200/60 dark:border-emerald-800/30 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => navigate("/reels")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center justify-between">
            <div className="flex flex-col items-start space-y-2">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-200">
                Create Reels
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Upload and share video content
              </p>
            </div>
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300 group-hover:scale-110">
              <PlusCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div
          className="group relative bg-gradient-to-br from-orange-50 via-white to-orange-50/50 dark:from-orange-950/20 dark:via-background dark:to-orange-950/10 border border-orange-200/60 dark:border-orange-800/30 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => navigate("/deal-upload")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center justify-between">
            <div className="flex flex-col items-start space-y-2">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-200">
                Add Deals
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Create new special offers for customers
              </p>
            </div>
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300 group-hover:scale-110">
              <PlusCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
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
