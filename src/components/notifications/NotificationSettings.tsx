
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/contexts/NotificationContext';
import { Bell, Mail, Smartphone, AlertCircle } from 'lucide-react';

const NotificationSettings = () => {
  const { settings, updateSettings } = useNotifications();

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    updateSettings({ [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Manage how you receive deal alerts and notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Deal Type Notifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Deal Notifications</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-deals">New Deals</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new deals are posted
              </p>
            </div>
            <Switch
              id="new-deals"
              checked={settings.newDeals}
              onCheckedChange={(checked) => handleSettingChange('newDeals', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="expiring-deals">Expiring Deals</Label>
              <p className="text-sm text-muted-foreground">
                Alert when deals are about to expire
              </p>
            </div>
            <Switch
              id="expiring-deals"
              checked={settings.expiringDeals}
              onCheckedChange={(checked) => handleSettingChange('expiringDeals', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="price-drops">Price Drops</Label>
              <p className="text-sm text-muted-foreground">
                Notify when prices drop on deals
              </p>
            </div>
            <Switch
              id="price-drops"
              checked={settings.priceDrops}
              onCheckedChange={(checked) => handleSettingChange('priceDrops', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="saved-deals">Saved Deal Updates</Label>
              <p className="text-sm text-muted-foreground">
                Updates on your saved deals
              </p>
            </div>
            <Switch
              id="saved-deals"
              checked={settings.savedDealUpdates}
              onCheckedChange={(checked) => handleSettingChange('savedDealUpdates', checked)}
            />
          </div>
        </div>

        <Separator />

        {/* Delivery Method */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Delivery Method</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Instant alerts in the app
                </p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Weekly deal digest via email
                </p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Smart Notifications</p>
            <p className="text-blue-700">
              We'll only send you relevant notifications based on your preferences and activity.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
