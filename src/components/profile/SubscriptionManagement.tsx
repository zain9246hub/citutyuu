import React, { useState, useMemo } from 'react';
import { useAdvertisements } from '@/contexts/AdvertisementContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, RefreshCw, AlertCircle, Tag, Image, Building, Video } from 'lucide-react';
import RenewalPreviewDialog from './RenewalPreviewDialog';
import { Deal } from '@/types/deal';

const SubscriptionManagement: React.FC = () => {
  const { uploadedAds } = useAdvertisements();
  const { currentUser } = useAuth();
  const [renewalType, setRenewalType] = useState<'banner' | 'deal' | null>(null);
  const [renewalId, setRenewalId] = useState<string | null>(null);
  const [showRenewalDialog, setShowRenewalDialog] = useState(false);

  // Filter banners by current user
  const userBanners = uploadedAds.filter(ad => 
    ad.uploadedBy === currentUser?.name
  );

  // Get user deals from localStorage
  const userDeals = useMemo(() => {
    const userDealsString = localStorage.getItem('userDeals');
    if (!userDealsString || !currentUser) return [];
    
    try {
      const deals: Deal[] = JSON.parse(userDealsString);
      return deals.filter(deal => 
        deal.uploadedBy === currentUser.name && 
        deal.subscriptionEndDate
      );
    } catch (error) {
      console.error('Error loading user deals:', error);
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

  const hasAnySubscriptions = userBanners.length > 0 || userDeals.length > 0;

  const renderSubscriptionCard = (
    id: string,
    title: string,
    location: string,
    startDate: string,
    endDate: string,
    price: number,
    type: 'banner' | 'deal',
    icon: React.ReactNode
  ) => {
    const daysRemaining = getDaysRemaining(endDate);
    const isExpiringSoon = daysRemaining <= 3;
    const isExpired = daysRemaining < 0;

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
          <Button
            size="sm"
            variant={isExpiringSoon || isExpired ? "default" : "outline"}
            onClick={() => type === 'banner' ? handleRenewBanner(id) : handleRenewDeal(parseInt(id))}
            className="gap-2"
          >
            <RefreshCw className="w-3 h-3" />
            {isExpired ? 'Reactivate' : 'Renew Now'}
          </Button>
        </div>
      </div>
    );
  };

  if (!hasAnySubscriptions) {
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
      <Card>
        <CardHeader>
          <CardTitle>My Subscriptions</CardTitle>
          <CardDescription>Manage and renew your paid subscriptions</CardDescription>
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
              <p className="text-muted-foreground text-center py-8">No business subscriptions found</p>
            </TabsContent>

            <TabsContent value="reels" className="space-y-4 mt-4">
              <p className="text-muted-foreground text-center py-8">No reel subscriptions found</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
