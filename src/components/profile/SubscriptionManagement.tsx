import React, { useState } from 'react';
import { useAdvertisements } from '@/contexts/AdvertisementContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import SlotBookingForm from '@/components/slot/SlotBookingForm';

const SubscriptionManagement: React.FC = () => {
  const { uploadedAds } = useAdvertisements();
  const { currentUser } = useAuth();
  const [renewalAdId, setRenewalAdId] = useState<string | null>(null);
  const [showRenewalForm, setShowRenewalForm] = useState(false);

  // Filter ads by current user
  const userAds = uploadedAds.filter(ad => 
    ad.uploadedBy === currentUser?.name
  );

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

  const handleRenew = (ad: any) => {
    setRenewalAdId(ad.id);
    setShowRenewalForm(true);
  };

  if (userAds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Subscriptions</CardTitle>
          <CardDescription>Manage your advertisement subscriptions</CardDescription>
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
          <CardDescription>Manage your advertisement subscriptions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userAds.map(ad => {
            const daysRemaining = getDaysRemaining(ad.subscriptionEndDate);
            const isExpiringSoon = daysRemaining <= 3;
            const isExpired = daysRemaining < 0;

            return (
              <div key={ad.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{ad.title}</h3>
                    <p className="text-sm text-muted-foreground">{ad.location}</p>
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
                      {formatDate(ad.subscriptionStartDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(ad.subscriptionEndDate)}
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
                  <p className="text-sm font-medium">₹{ad.monthlyPrice}/month</p>
                  <Button
                    size="sm"
                    variant={isExpiringSoon || isExpired ? "default" : "outline"}
                    onClick={() => handleRenew(ad)}
                    className="gap-2"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {isExpired ? 'Reactivate' : 'Renew Now'}
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {showRenewalForm && renewalAdId && (
        <SlotBookingForm
          open={showRenewalForm}
          onClose={() => {
            setShowRenewalForm(false);
            setRenewalAdId(null);
          }}
          slotId="renewal"
          location="Renewal"
          isRenewal={true}
          existingAdId={renewalAdId}
          onSuccess={() => {
            setShowRenewalForm(false);
            setRenewalAdId(null);
          }}
        />
      )}
    </>
  );
};

export default SubscriptionManagement;
