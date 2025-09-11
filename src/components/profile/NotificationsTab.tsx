
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotificationSettings from "@/components/notifications/NotificationSettings";
import NotificationList from "@/components/notifications/NotificationList";

const NotificationsTab = () => {
  return (
    <div className="p-4 bg-gradient-to-b from-background to-muted/20">
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 backdrop-blur-sm border border-border/50 shadow-sm">
          <TabsTrigger 
            value="notifications" 
            className="data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground transition-all duration-200"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground transition-all duration-200"
          >
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="notifications" className="mt-6">
          <NotificationList />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsTab;
