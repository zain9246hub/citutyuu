
import { User } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessAnalytics from "@/components/analytics/BusinessAnalytics";
import DealCard from "@/components/DealCard";
import NotificationsTab from "@/components/profile/NotificationsTab";
import SubscriptionManagement from "@/components/profile/SubscriptionManagement";
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans';
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
    <div className="space-y-4 p-1">
      <div className="grid grid-cols-1 gap-4">
        <div
          className="group relative bg-gradient-to-br from-blue-50/80 via-white to-blue-50/50 dark:from-blue-950/30 dark:via-background dark:to-blue-950/20 border border-blue-200/40 dark:border-blue-800/40 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
          onClick={() => navigate("/business-upload")}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start space-y-2 flex-1">
              <h3 className="font-semibold text-base text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                Add New Business
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload and manage your business listings
              </p>
            </div>
            <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105">
              <Store className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div
          className="group relative bg-gradient-to-br from-purple-50/80 via-white to-purple-50/50 dark:from-purple-950/30 dark:via-background dark:to-purple-950/20 border border-purple-200/40 dark:border-purple-800/40 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
          onClick={() => navigate("/all-banners")}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start space-y-2 flex-1">
              <h3 className="font-semibold text-base text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                Manage Ad Slots
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Book ad slots for your business
              </p>
            </div>
            <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-purple-500/30 transition-all duration-300 group-hover:scale-105">
              <PlusCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div
          className="group relative bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/50 dark:from-emerald-950/30 dark:via-background dark:to-emerald-950/20 border border-emerald-200/40 dark:border-emerald-800/40 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
          onClick={() => navigate("/reels")}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start space-y-2 flex-1">
              <h3 className="font-semibold text-base text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                Create Reels
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload and share video content
              </p>
            </div>
            <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-emerald-500/30 transition-all duration-300 group-hover:scale-105">
              <PlusCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div
          className="group relative bg-gradient-to-br from-orange-50/80 via-white to-orange-50/50 dark:from-orange-950/30 dark:via-background dark:to-orange-950/20 border border-orange-200/40 dark:border-orange-800/40 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
          onClick={() => navigate("/deal-upload")}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start space-y-2 flex-1">
              <h3 className="font-semibold text-base text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                Add Deals
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create new special offers for customers
              </p>
            </div>
            <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-orange-500/30 transition-all duration-300 group-hover:scale-105">
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
          gridTemplateColumns: currentUser.role === "business" ? "repeat(5, 1fr)" : "repeat(3, 1fr)" 
        }}
      >
        <TabsTrigger value="profile">Profile</TabsTrigger>
        {currentUser.role === "business" && (
          <>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </>
        )}
        {currentUser.role === "explorer" && (
          <TabsTrigger value="saved">Saved</TabsTrigger>
        )}
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="p-4 bg-gradient-to-b from-background to-muted/10 rounded-xl border border-border/50 shadow-sm">
        {!isEditing && (
          <div className="space-y-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 border border-border/30 rounded-2xl p-6 shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-primary/60 transform translate-x-16 -translate-y-16" />
              </div>
              
              <div className="relative">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                    <div className="w-5 h-5 bg-gradient-to-br from-primary to-primary/80 rounded-md" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Account Information</h3>
                </div>
                
                <div className="space-y-5">
                  <div className="group p-4 rounded-xl bg-gradient-to-r from-muted/20 to-muted/5 border border-border/20 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-200">Name:</span>
                      <span className="text-foreground font-semibold">{currentUser.name}</span>
                    </div>
                  </div>
                  
                  <div className="group p-4 rounded-xl bg-gradient-to-r from-muted/20 to-muted/5 border border-border/20 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-200">Email:</span>
                      <span className="text-foreground font-semibold">{currentUser.email}</span>
                    </div>
                  </div>
                  
                  <div className="group p-4 rounded-xl bg-gradient-to-r from-muted/20 to-muted/5 border border-border/20 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-200">Account Type:</span>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20">
                          {currentUser.role === "business" ? "Business" : "Explorer"}
                        </span>
                      </div>
                    </div>
                  </div>
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

          <TabsContent value="subscriptions" className="space-y-4">
            <SubscriptionPlans />
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
