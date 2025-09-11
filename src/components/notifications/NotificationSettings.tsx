import { useState } from "react";
import { Bell, Mail, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: "deals" | "delivery";
}

const NotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "new-deals",
      title: "New Deals",
      description: "Get notified when new deals are posted",
      enabled: true,
      category: "deals"
    },
    {
      id: "expiring-deals",
      title: "Expiring Deals",
      description: "Alert when deals are about to expire",
      enabled: true,
      category: "deals"
    },
    {
      id: "price-drops",
      title: "Price Drops",
      description: "Notify when prices drop on deals",
      enabled: true,
      category: "deals"
    },
    {
      id: "saved-updates",
      title: "Saved Deal Updates",
      description: "Updates on your saved deals",
      enabled: true,
      category: "deals"
    },
    {
      id: "push-notifications",
      title: "Push Notifications",
      description: "Instant alerts in the app",
      enabled: true,
      category: "delivery"
    },
    {
      id: "email-notifications",
      title: "Email Notifications",
      description: "Weekly deal digest via email",
      enabled: false,
      category: "delivery"
    }
  ]);

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const dealSettings = settings.filter(s => s.category === "deals");
  const deliverySettings = settings.filter(s => s.category === "delivery");

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-background via-background to-muted/20 border-border/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">Notification Settings</CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Manage how you receive deal alerts and notifications
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-6 text-foreground">Deal Notifications</h3>
            <div className="space-y-5">
              {dealSettings.map((setting) => (
                <div key={setting.id} className="group p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 border border-border/30 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="text-base font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                        {setting.title}
                      </div>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        {setting.description}
                      </div>
                    </div>
                    <Switch
                      checked={setting.enabled}
                      onCheckedChange={() => toggleSetting(setting.id)}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div>
            <h3 className="text-lg font-semibold mb-6 text-foreground">Delivery Method</h3>
            <div className="space-y-5">
              {deliverySettings.map((setting) => (
                <div key={setting.id} className="group p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 border border-border/30 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/10 rounded-lg flex items-center justify-center">
                        {setting.id === "push-notifications" ? (
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="text-base font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                          {setting.title}
                        </div>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {setting.description}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={setting.enabled}
                      onCheckedChange={() => toggleSetting(setting.id)}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:via-blue-950/20 dark:to-blue-950/10 p-6 rounded-2xl border border-blue-200/50 dark:border-blue-800/30 shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent" />
            <div className="relative flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">i</span>
              </div>
              <div>
                <h4 className="text-base font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Smart Notifications
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-200 leading-relaxed">
                  We'll only send you relevant notifications based on your preferences and activity.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;