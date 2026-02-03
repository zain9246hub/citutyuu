import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdvertisements } from '@/contexts/AdvertisementContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, RefreshCw, AlertCircle, Tag, Image, Building, Video, Bell, MessageCircle, Sparkles, CheckCircle, BarChart3 } from 'lucide-react';
import RenewalPreviewDialog from './RenewalPreviewDialog';
import { Deal } from '@/types/deal';

type RenewalType = 'banner' | 'deal' | 'business';

const SubscriptionManagement: React.FC = () => {
  const navigate = useNavigate();
  const { uploadedAds } = useAdvertisements();
  const { currentUser } = useAuth();
  const { hasSubscription, getSubscriptionDetails, renewSubscription } = useSubscription();
  const [renewalType, setRenewalType] = useState<RenewalType | null>(null);
  const [renewalId, setRenewalId] = useState<string | null>(null);
  const [showRenewalDialog, setShowRenewalDialog] = useState(false);
  const [showPlanRenewalConfirm, setShowPlanRenewalConfirm] = useState<string | null>(null);

  const isOwnedByCurrentUser = (uploadedBy?: string | null) => {
    if (!currentUser) return false;
    // Back-compat: older data may not store uploadedBy; treat it as belonging to this device/user.
    if (!uploadedBy) return true;

    const candidate = uploadedBy.toLowerCase();
    const keys = [currentUser.name, currentUser.email, currentUser.id]
      .filter(Boolean)
      .map((k) => k.toLowerCase());

    return keys.some((k) => candidate === k || candidate.includes(k) || k.includes(candidate));
  };

  // Filter banners by current user
  const userBanners = useMemo(() => {
    if (!currentUser) return [];
    return uploadedAds.filter((ad) => isOwnedByCurrentUser(ad.uploadedBy));
  }, [uploadedAds, currentUser]);

  // Get user deals from localStorage
  const userDeals = useMemo(() => {
    const userDealsString = localStorage.getItem('userDeals');
    if (!userDealsString || !currentUser) return [];
    
    try {
      const deals: Deal[] = JSON.parse(userDealsString);

      const normalized = deals
        .filter((deal) => isOwnedByCurrentUser(deal.uploadedBy))
        // Only show deals that are paid / subscription-based; for backward compatibility,
        // treat missing subscription dates as a 30-day subscription.
        .filter((deal) => Boolean(deal.subscriptionEndDate || deal.subscriptionStartDate || deal.tier))
        .map((deal) => {
          if (deal.subscriptionStartDate && deal.subscriptionEndDate) return deal;

          // Back-compat: infer dates from timestamp-like IDs if possible.
          const idAsNumber = typeof deal.id === 'number' ? deal.id : Number.NaN;
          const inferredStart = Number.isFinite(idAsNumber) && idAsNumber > 1000000000000
            ? new Date(idAsNumber)
            : new Date();
          const inferredEnd = new Date(inferredStart.getTime() + 30 * 24 * 60 * 60 * 1000);

          return {
            ...deal,
            subscriptionStartDate: deal.subscriptionStartDate || inferredStart.toISOString(),
            subscriptionEndDate: deal.subscriptionEndDate || inferredEnd.toISOString(),
          };
        });

      return normalized;
    } catch (error) {
      console.error('Error loading user deals:', error);
      return [];
    }
  }, [currentUser]);

  // Get user businesses from localStorage
  const userBusinesses = useMemo(() => {
    try {
      const stored = localStorage.getItem('userBusinesses');
      if (!stored || !currentUser) return [];
      
      const businesses = JSON.parse(stored);

      if (!Array.isArray(businesses)) return [];

      const normalized = businesses
        .filter((b) => isOwnedByCurrentUser(b.uploadedBy))
        // Only show items that have (or can infer) subscription dates.
        .map((b) => {
          if (b.subscriptionStartDate && b.subscriptionEndDate) return b;
          const now = new Date();
          const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          return {
            ...b,
            subscriptionStartDate: b.subscriptionStartDate || now.toISOString(),
            subscriptionEndDate: b.subscriptionEndDate || end.toISOString(),
          };
        });

      return normalized;
    } catch (error) {
      console.error('Error loading user businesses:', error);
      return [];
    }
  }, [currentUser]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (endDateString: string) => {
    const endDate = new Date(endDateString);
    const now = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const handleRenewBanner = (bannerId: string) => {
    setRenewalType('banner');
    setRenewalId(bannerId);
    setShowRenewalDialog(true);
  };

  const handleRenewDeal = (dealId: number) => {
    setRenewalType('deal');
    setRenewalId(dealId.toString());
    setShowRenewalDialog(true);
  };

  const handleRenewBusiness = (businessId: string) => {
    setRenewalType('business');
    setRenewalId(businessId);
    setShowRenewalDialog(true);
  };

  const hasAnySubscriptions = userBanners.length > 0 || userDeals.length > 0 || userBusinesses.length > 0;

  const renderSubscriptionCard = (
    id: string,
    title: string,
    location: string,
    startDate: string,
    endDate: string,
    price: number,
    type: RenewalType,
    icon: React.ReactNode
  ) => {
    const daysRemaining = getDaysRemaining(endDate);
    const isExpiringSoon = daysRemaining <= 3;
    const isExpired = daysRemaining < 0;

    const handleAnalytics = () => {
      if (type === 'banner') {
        navigate(`/banner-analytics/${id}`);
      } else if (type === 'business') {
        navigate(`/business-analytics/${id}`);
      } else if (type === 'deal') {
        navigate(`/deal-analytics/${id}`);
      }
    };

    return (
      <div key={id} className="border rounded-lg p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-lg bg-primary/10">
              {icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
          </div>
          {isExpired ? (
            <Badge variant="destructive">Expired</Badge>
          ) : isExpiringSoon ? (
            <Badge variant="outline" className="border-amber-500 text-amber-600">
              <AlertCircle className="w-3 h-3 mr-1" />
              Expiring Soon
            </Badge>
          ) : (
            <Badge variant="outline" className="border-green-500 text-green-600">Active</Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Start Date</p>
            <p className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(startDate)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">End Date</p>
            <p className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(endDate)}
            </p>
          </div>
        </div>

        {!isExpired && (
          <div className="text-sm">
            <p className="text-muted-foreground">Days Remaining</p>
            <p className="font-medium">{daysRemaining} days</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <p className="text-sm font-medium">₹{price}/month</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleAnalytics}
              className="gap-2"
            >
              <BarChart3 className="w-3 h-3" />
              Analytics
            </Button>
            <Button
              size="sm"
              variant={isExpiringSoon || isExpired ? "default" : "outline"}
              onClick={() => {
                if (type === 'banner') return handleRenewBanner(id);
                if (type === 'deal') return handleRenewDeal(parseInt(id));
                return handleRenewBusiness(id);
              }}
              className="gap-2"
            >
              <RefreshCw className="w-3 h-3" />
              {isExpired ? 'Reactivate' : 'Renew'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Active user plan subscriptions with expiry details
  const activePlans = [
    { id: 'notifications', name: 'Notifications', price: 69, icon: Bell, gradient: 'from-pink-500 to-rose-600' },
    { id: 'cityChat', name: 'City Chat', price: 69, icon: MessageCircle, gradient: 'from-purple-500 to-indigo-600' },
    { id: 'voiceMessages', name: 'All Access', price: 119, icon: Sparkles, gradient: 'from-orange-500 to-red-600' },
  ].filter(plan => hasSubscription(plan.id as 'notifications' | 'cityChat' | 'voiceMessages'))
   .map(plan => {
     const details = getSubscriptionDetails(plan.id as 'notifications' | 'cityChat' | 'voiceMessages');
     return {
       ...plan,
       startDate: details?.startDate || new Date().toISOString(),
       endDate: details?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
     };
   });

  const handleRenewPlan = (planId: string) => {
    renewSubscription(planId as 'notifications' | 'cityChat' | 'voiceMessages');
    setShowPlanRenewalConfirm(null);
  };

  const hasActivePlans = activePlans.length > 0;

  if (!hasAnySubscriptions && !hasActivePlans) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Subscriptions</CardTitle>
          <CardDescription>Manage your subscription renewals</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You don't have any active subscriptions yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Active User Plans Section */}
      {hasActivePlans && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Active Plans
            </CardTitle>
            <CardDescription>Your currently active subscription plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {activePlans.map((plan) => {
                const daysRemaining = getDaysRemaining(plan.endDate);
                const isExpiringSoon = daysRemaining <= 3 && daysRemaining > 0;
                const isExpired = daysRemaining <= 0;
                
                return (
                  <div
                    key={plan.id}
                    className={`relative overflow-hidden rounded-xl border border-border bg-card p-4 space-y-3`}
                  >
                    {/* Header with icon and status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center`}>
                          <plan.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">₹{plan.price}/month</p>
                        </div>
                      </div>
                      {isExpired ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : isExpiringSoon ? (
                        <Badge variant="outline" className="border-amber-500 text-amber-600">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Expiring Soon
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-green-500 text-green-600">Active</Badge>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Start Date</p>
                        <p className="flex items-center gap-1 text-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(plan.startDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">End Date</p>
                        <p className="flex items-center gap-1 text-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(plan.endDate)}
                        </p>
                      </div>
                    </div>

                    {/* Days remaining */}
                    {!isExpired && (
                      <div className="text-sm">
                        <p className="text-muted-foreground">Days Remaining</p>
                        <p className="font-medium text-foreground">{daysRemaining} days</p>
                      </div>
                    )}

                    {/* Renew button */}
                    <div className="flex items-center justify-end pt-2 border-t border-border">
                      <Button
                        size="sm"
                        variant={isExpiringSoon || isExpired ? "default" : "outline"}
                        onClick={() => setShowPlanRenewalConfirm(plan.id)}
                        className="gap-2"
                      >
                        <RefreshCw className="w-3 h-3" />
                        {isExpired ? 'Reactivate' : 'Renew Now'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Renewal Confirmation Dialog */}
      {showPlanRenewalConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border p-6 max-w-sm w-full space-y-4">
            <h3 className="font-semibold text-lg text-foreground">Confirm Renewal</h3>
            <p className="text-muted-foreground">
              Renew your subscription for another 30 days?
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowPlanRenewalConfirm(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleRenewPlan(showPlanRenewalConfirm)}>
                Confirm Renewal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Business Listings Section */}
      {hasAnySubscriptions && (
      <Card>
        <CardHeader>
          <CardTitle>My Business Listings</CardTitle>
          <CardDescription>Manage and renew your paid business subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="banners" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="banners" className="gap-2">
                <Image className="w-4 h-4" />
                Banners
              </TabsTrigger>
              <TabsTrigger value="deals" className="gap-2">
                <Tag className="w-4 h-4" />
                Deals
              </TabsTrigger>
              <TabsTrigger value="businesses" className="gap-2">
                <Building className="w-4 h-4" />
                Businesses
              </TabsTrigger>
              <TabsTrigger value="reels" className="gap-2">
                <Video className="w-4 h-4" />
                Reels
              </TabsTrigger>
            </TabsList>

            <TabsContent value="banners" className="space-y-4 mt-4">
              {userBanners.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No banner subscriptions found</p>
              ) : (
                userBanners.map(banner => 
                  renderSubscriptionCard(
                    banner.id,
                    banner.title,
                    banner.location,
                    banner.subscriptionStartDate,
                    banner.subscriptionEndDate,
                    banner.monthlyPrice,
                    'banner',
                    <Image className="w-4 h-4 text-primary" />
                  )
                )
              )}
            </TabsContent>

            <TabsContent value="deals" className="space-y-4 mt-4">
              {userDeals.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No deal subscriptions found</p>
              ) : (
                userDeals.map(deal => 
                  renderSubscriptionCard(
                    deal.id.toString(),
                    deal.title,
                    deal.city,
                    deal.subscriptionStartDate!,
                    deal.subscriptionEndDate!,
                    deal.subscriptionPrice || 0,
                    'deal',
                    <Tag className="w-4 h-4 text-primary" />
                  )
                )
              )}
            </TabsContent>

            <TabsContent value="businesses" className="space-y-4 mt-4">
              {userBusinesses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No business subscriptions found</p>
              ) : (
                userBusinesses.map(business => 
                  renderSubscriptionCard(
                    business.id,
                    business.name,
                    business.city,
                    business.subscriptionStartDate || new Date().toISOString(),
                    business.subscriptionEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    business.subscriptionPrice || 999,
                    'business',
                    <Building className="w-4 h-4 text-primary" />
                  )
                )
              )}
            </TabsContent>

            <TabsContent value="reels" className="space-y-4 mt-4">
              <p className="text-muted-foreground text-center py-8">No reel subscriptions found</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      )}

      {showRenewalDialog && renewalId && renewalType && (
        <RenewalPreviewDialog
          open={showRenewalDialog}
          onOpenChange={(open) => {
            setShowRenewalDialog(open);
            if (!open) {
              setRenewalId(null);
              setRenewalType(null);
            }
          }}
          type={renewalType}
          itemId={renewalId}
        />
      )}
    </>
  );
};

export default SubscriptionManagement;
